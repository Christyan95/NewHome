-- ===============================================================
-- MASTER SCHEMA & SEED - NEWHOME PROJECT
-- Idempotent Senior Architecture (Safe to run multiple times)
-- ===============================================================

-- 1. TABLES DEFINITION (Created first to avoid dependency errors)
CREATE TABLE IF NOT EXISTS myhome_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL CHECK (char_length(name) <= 100),
    category TEXT NOT NULL CHECK (char_length(category) <= 50),
    image TEXT CHECK (char_length(image) <= 500),
    total_value NUMERIC(10,2) NOT NULL CHECK (total_value > 0 AND total_value < 100000),
    total_quotas INT NOT NULL DEFAULT 1 CHECK (total_quotas > 0 AND total_quotas <= 1000),
    sold_quotas INT NOT NULL DEFAULT 0 CHECK (sold_quotas >= 0),
    active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS myhome_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    product_id UUID REFERENCES myhome_products(id) ON DELETE CASCADE,
    giver_name TEXT NOT NULL CHECK (char_length(giver_name) <= 100),
    quotas_count INT NOT NULL DEFAULT 1 CHECK (quotas_count > 0 AND quotas_count <= 100),
    amount_paid NUMERIC(10,2) NOT NULL CHECK (amount_paid >= 0 AND amount_paid < 100000),
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

CREATE TABLE IF NOT EXISTS myhome_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    sender_name TEXT NOT NULL CHECK (char_length(sender_name) <= 100),
    content TEXT NOT NULL CHECK (char_length(content) <= 1000),
    is_public BOOLEAN DEFAULT true
);

-- 2. INDEXING
CREATE INDEX IF NOT EXISTS idx_products_category ON myhome_products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON myhome_products(active);
CREATE INDEX IF NOT EXISTS idx_contributions_product_id ON myhome_contributions(product_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON myhome_contributions(status);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON myhome_messages(created_at DESC);

-- 3. SENIOR LOGIC: ATOMIC UPDATES (TRIGGER)
-- Improved with extra safety checks
CREATE OR REPLACE FUNCTION trg_update_product_on_contribution()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if confirmed and has a valid product
  IF NEW.status = 'confirmed' AND NEW.product_id IS NOT NULL THEN
    UPDATE myhome_products
    SET sold_quotas = LEAST(total_quotas, sold_quotas + NEW.quotas_count)
    WHERE id = NEW.product_id
      AND active = true; -- Extra safety: only active products
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Safe Trigger Creation
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'myhome_contributions') THEN
        DROP TRIGGER IF EXISTS on_contribution_confirmed ON myhome_contributions;
        CREATE TRIGGER on_contribution_confirmed
        AFTER INSERT ON myhome_contributions
        FOR EACH ROW EXECUTE FUNCTION trg_update_product_on_contribution();
    END IF;
END $$;

-- 4. SECURITY (RLS)
ALTER TABLE myhome_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE myhome_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE myhome_messages ENABLE ROW LEVEL SECURITY;

-- Safe Policy Creation (More explicit access control)
DO $$
BEGIN
    -- Products: Everyone can read active products
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable Read Access' AND tablename = 'myhome_products') THEN
        CREATE POLICY "Enable Read Access" ON myhome_products FOR SELECT USING (active = true);
    END IF;

    -- Contributions: Public can only insert confirmed ones with reasonable amounts
    -- (Simulating basic validation at the DB layer)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable Insert for Guests' AND tablename = 'myhome_contributions') THEN
        CREATE POLICY "Enable Insert for Guests" ON myhome_contributions FOR INSERT 
        WITH CHECK (status = 'confirmed' AND amount_paid > 0);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable Select for Guests' AND tablename = 'myhome_contributions') THEN
        CREATE POLICY "Enable Select for Guests" ON myhome_contributions FOR SELECT USING (true);
    END IF;

    -- Messages: Public can insert reasonable length messages
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable Insert for Messages' AND tablename = 'myhome_messages') THEN
        CREATE POLICY "Enable Insert for Messages" ON myhome_messages FOR INSERT 
        WITH CHECK (char_length(content) > 0 AND char_length(content) <= 1000);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable Select for Public Messages' AND tablename = 'myhome_messages') THEN
        CREATE POLICY "Enable Select for Public Messages" ON myhome_messages FOR SELECT USING (is_public = true);
    END IF;
END $$;

-- 5. INITIAL DATA SEED
-- Omit ID and created_at to let the database generate them dynamically
-- (Assuming seeding is handled manually or via migration script)

-- 6. ATIVAR REALTIME
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
  
  -- Add tables safely
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE myhome_products;
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE myhome_messages;
  EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;
