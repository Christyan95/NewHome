-- ===============================================================
-- MASTER SCHEMA & SEED - NEWHOME PROJECT
-- Idempotent Senior Architecture (Safe to run multiple times)
-- ===============================================================

-- 1. TABLES DEFINITION (Created first to avoid dependency errors)
CREATE TABLE IF NOT EXISTS myhome_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT,
    total_value NUMERIC(10,2) NOT NULL CHECK (total_value > 0),
    total_quotas INT NOT NULL DEFAULT 1 CHECK (total_quotas > 0),
    sold_quotas INT NOT NULL DEFAULT 0 CHECK (sold_quotas >= 0),
    active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS myhome_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    product_id UUID REFERENCES myhome_products(id) ON DELETE CASCADE,
    giver_name TEXT NOT NULL,
    quotas_count INT NOT NULL DEFAULT 1 CHECK (quotas_count > 0),
    amount_paid NUMERIC(10,2) NOT NULL CHECK (amount_paid >= 0),
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

CREATE TABLE IF NOT EXISTS myhome_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    sender_name TEXT NOT NULL,
    content TEXT NOT NULL,
    is_public BOOLEAN DEFAULT true
);

-- 2. INDEXING
CREATE INDEX IF NOT EXISTS idx_products_category ON myhome_products(category);
CREATE INDEX IF NOT EXISTS idx_contributions_product_id ON myhome_contributions(product_id);

-- 3. SENIOR LOGIC: ATOMIC UPDATES (TRIGGER)
-- Using OR REPLACE to ensure updates
CREATE OR REPLACE FUNCTION trg_update_product_on_contribution()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND NEW.product_id IS NOT NULL THEN
    UPDATE myhome_products
    SET sold_quotas = LEAST(total_quotas, sold_quotas + NEW.quotas_count)
    WHERE id = NEW.product_id;
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

-- Safe Policy Creation (Checks if policy exists to avoid errors)
DO $$
BEGIN
    -- Products
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable Read Access' AND tablename = 'myhome_products') THEN
        CREATE POLICY "Enable Read Access" ON myhome_products FOR SELECT USING (true);
    END IF;
    -- Contributions
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable Insert for All' AND tablename = 'myhome_contributions') THEN
        CREATE POLICY "Enable Insert for All" ON myhome_contributions FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable Select for All' AND tablename = 'myhome_contributions') THEN
        CREATE POLICY "Enable Select for All" ON myhome_contributions FOR SELECT USING (true);
    END IF;
    -- Messages
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable Insert for All Messages' AND tablename = 'myhome_messages') THEN
        CREATE POLICY "Enable Insert for All Messages" ON myhome_messages FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable Select for All Messages' AND tablename = 'myhome_messages') THEN
        CREATE POLICY "Enable Select for All Messages" ON myhome_messages FOR SELECT USING (true);
    END IF;
END $$;

-- 5. INITIAL DATA SEED
-- Omit ID and created_at to let the database generate them dynamically at the moment of insertion
INSERT INTO myhome_products (name, category, image, total_value, total_quotas, sold_quotas, active) VALUES
('Máquina de Lavar', 'Lavanderia', 'https://http2.mlstatic.com/D_NQ_NP_2X_752745-MLA85766828661_062025-F.webp', 2000.00, 10, 0, true),
('Panela de Pressão Elétrica', 'Cozinha', 'https://http2.mlstatic.com/D_NQ_NP_2X_613982-MLA99455777994_112025-F.webp', 380.00, 2, 0, true),
('Tapete Banheiro', 'Banheiro', 'https://http2.mlstatic.com/D_NQ_NP_2X_720765-MLB106247132293_012026-F-tapete-banheiro-decorativo-bolinhas-macio-sortido-50x70.webp', 60.00, 1, 0, true),
('Jogo de Toalhas Rosto', 'Banheiro', 'https://http2.mlstatic.com/D_NQ_NP_2X_837459-MLB82112357886_022025-F-toalha-de-mo-buddemeyer-lavabo-banheiro-100algodo-kit-2un.webp', 100.00, 1, 0, true),
('Aparador', 'Sala', 'https://http2.mlstatic.com/D_NQ_NP_2X_992512-MLB80971673379_112024-F-aparador-rack-reforcado-grande-compacto-sala-tv-casa-moderna.webp', 320.00, 2, 0, true),
('Ferro ou Vaporizador', 'Lavanderia', 'https://http2.mlstatic.com/D_NQ_NP_2X_995091-MLA99426988714_112025-F.webp', 150.00, 1, 0, true),
('Placa 3d tijolinho', 'Decoração', 'https://http2.mlstatic.com/D_NQ_NP_2X_683314-MLB85406990287_052025-F-kit-30-placas-adesiva-vinil-autocolante-tijolinho-3d-lavavel.webp', 100.00, 1, 0, true),
('Escorredor de Louça', 'Cozinha', 'https://http2.mlstatic.com/D_NQ_NP_2X_846269-MLA95978058552_102025-F.webp', 70.00, 1, 0, true),
('Cama Casal / Queen', 'Quarto', 'https://http2.mlstatic.com/D_NQ_NP_2X_931713-MLB85778290791_062025-F-box-bau-com-colcho-de-molas-anjos-classic-queen-158-cm.webp', 1900.00, 10, 0, true),
('Cesto de Roupa Suja', 'Lavanderia', 'https://http2.mlstatic.com/D_NQ_NP_2X_853209-MLB97567425729_112025-F.webp', 60.00, 1, 0, true),
('Cozinha Modulada', 'Cozinha', 'https://http2.mlstatic.com/D_NQ_NP_2X_780754-MLB101188993112_122025-F.webp', 1750.00, 10, 0, true),
('Sofá', 'Sala', 'https://http2.mlstatic.com/D_NQ_NP_2X_681852-MLB97840510155_112025-F-sofa-cama-retratil-reclinavel-3-lugares-linho-200m-ipanema.webp', 1700.00, 10, 0, true),
('Faqueiro', 'Cozinha', 'https://http2.mlstatic.com/D_NQ_NP_2X_967617-MLA99958283381_112025-F.webp', 60.00, 1, 0, true),
('Kit Facas e Talheres', 'Cozinha', 'https://http2.mlstatic.com/D_NQ_NP_2X_879161-MLB75228970428_032024-F-faqueiro-ipanema-com-lmina-aco-inox-24-pecas-tramontina.webp', 120.00, 1, 0, true),
('Varal Retrátil', 'Lavanderia', 'https://http2.mlstatic.com/D_NQ_NP_2X_884392-MLB81366952140_122024-F-varal-de-parede-retratil-42-metro-fio-de-aco-inox-ate-20kg.webp', 60.00, 1, 0, true),
('Lixeira Cozinha', 'Cozinha', 'https://http2.mlstatic.com/D_NQ_NP_2X_739048-MLB86954209980_072025-F-lixeira-automatica-inteligente-para-cozinha-e-banheiro.webp', 70.00, 1, 0, true),
('Mop Limpeza', 'Limpeza', 'https://http2.mlstatic.com/D_NQ_NP_2X_999511-MLU74227124239_012024-F.webp', 80.00, 1, 0, true),
('Microondas', 'Cozinha', 'https://http2.mlstatic.com/D_NQ_NP_2X_687815-MLA99957156929_112025-F.webp', 600.00, 3, 0, true),
('Chuveiro', 'Banheiro', 'https://http2.mlstatic.com/D_NQ_NP_2X_630414-MLA99956863229_112025-F.webp', 340.00, 2, 0, true),
('Varal de Janela', 'Lavanderia', 'https://http2.mlstatic.com/D_NQ_NP_2X_751611-MLB71738802940_092023-F.webp', 120.00, 1, 0, true),
('Geladeira', 'Cozinha', 'https://http2.mlstatic.com/D_NQ_NP_2X_913290-MLA106081933679_012026-F.webp', 2700.00, 15, 0, true),
('Espelho Banheiro', 'Banheiro', 'https://http2.mlstatic.com/D_NQ_NP_2X_830137-MLB105498797626_012026-F-espelho-retangular-led-75x100-cm-jateado-lapidado-luxo.webp', 330.00, 2, 0, true),
('Liquidificador', 'Cozinha', 'https://http2.mlstatic.com/D_NQ_NP_2X_619525-MLA99455849002_112025-F.webp', 100.00, 1, 0, true),
('Pote de Vidro', 'Cozinha', 'https://http2.mlstatic.com/D_NQ_NP_2X_801476-MLB84457197668_052025-F-kit-10-potes-vidro-retangular-640ml-hermetico-reforcado.webp', 100.00, 1, 0, true),
('Escrivaninha', 'Escritório', 'https://http2.mlstatic.com/D_NQ_NP_2X_927775-MLB103882825005_012026-F.webp', 250.00, 2, 0, true),
('Televisão', 'Sala', 'https://http2.mlstatic.com/D_NQ_NP_2X_674822-MLA96870825149_102025-F.webp', 2000.00, 10, 0, true),
('Lava Louças', 'Cozinha', 'https://http2.mlstatic.com/D_NQ_NP_2X_972989-MLA99969943689_112025-F.webp', 1650.00, 10, 0, true),
('Aspirador de Pó', 'Limpeza', 'https://http2.mlstatic.com/D_NQ_NP_2X_782843-MLA99455309468_112025-F.webp', 130.00, 1, 0, true),
('Copos', 'Cozinha', 'https://http2.mlstatic.com/D_NQ_NP_2X_821161-MLA95702961110_102025-F.webp', 90.00, 1, 0, true),
('Conjunto de Panelas', 'Cozinha', 'https://http2.mlstatic.com/D_NQ_NP_2X_903305-MLA96099051539_102025-F.webp', 550.00, 5, 0, true),
('Air Fryer', 'Cozinha', 'https://http2.mlstatic.com/D_NQ_NP_2X_646055-MLA99511429566_112025-F.webp', 540.00, 3, 0, true),
('Cooktop', 'Cozinha', 'https://http2.mlstatic.com/D_NQ_NP_2X_914264-MLA99442299770_112025-F.webp', 360.00, 2, 0, true);

-- 6. ATIVAR REALTIME (Para atualizações instantâneas no site)
-- Isso garante que o site "ouça" as mudanças no banco sem precisar de F5.
DO $$
BEGIN
  -- Tenta criar a publicação se não existir
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
  
  -- Adiciona a tabela à publicação (ignora se já estiver adicionada)
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE myhome_products;
  EXCEPTION
    WHEN duplicate_object THEN
      NULL;
  END;
END $$;
