-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Tabela de Produtos (Lista de Presentes)
create table if not exists myhome_products (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  category text not null,
  image text not null,
  total_value decimal(10,2) not null,
  total_quotas integer not null,
  sold_quotas integer default 0,
  active boolean default true
);

-- 2. Tabela de Mensagens (Mural de Recados)
create table if not exists myhome_messages (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  sender_name text not null,
  content text not null,
  is_public boolean default true
);

-- 3. Tabela de Contribuições (Para registrar quem comprou qual cota)
create table if not exists myhome_contributions (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  product_id uuid references myhome_products(id),
  giver_name text not null,
  quotas_count integer default 1,
  amount_paid decimal(10,2) not null,
  status text default 'pending' -- 'pending', 'confirmed'
);

-- DADOS FICTÍCIOS (INSERTS)

-- Inserindo Produtos
insert into myhome_products (name, category, image, total_value, total_quotas, sold_quotas) values
('Geladeira Frost Free Inverter', 'Cozinha', 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=800', 2695.00, 10, 1),
('Cooktop 4 Bocas', 'Cozinha', 'https://images.unsplash.com/photo-1626077587747-975a6c4b2b3a?auto=format&fit=crop&q=80&w=800', 292.46, 2, 0),
('Micro-ondas', 'Cozinha', 'https://images.unsplash.com/photo-1585237672814-8f85a8118b95?auto=format&fit=crop&q=80&w=800', 409.00, 2, 0),
('Air Fryer', 'Cozinha', 'https://images.unsplash.com/photo-1729606869038-0418c32d4b68?q=80&w=800&auto=format&fit=crop', 406.77, 2, 0),
('Sofá Retrátil', 'Sala', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800', 2339.41, 10, 3),
('Smart TV 55"', 'Sala', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800', 2598.00, 10, 0),
('Jogo de Panelas', 'Cozinha', 'https://images.unsplash.com/photo-1584992236310-6eddd724a4c7?auto=format&fit=crop&q=80&w=800', 500.00, 5, 0),
('Aparelho de Jantar', 'Cozinha', 'https://images.unsplash.com/photo-1624364020942-5f6535df2a9c?auto=format&fit=crop&q=80&w=800', 700.00, 5, 1);

-- Inserindo Mensagens
insert into myhome_messages (sender_name, content) values
('Tia Maria', 'Que a felicidade faça morada nesse novo lar! Muitas bênçãos para vocês.'),
('Primos João e Ana', 'Parabéns pela conquista! Mal podemos esperar para o churrasco de inauguração!'),
('Vó Lurdes', 'Deus abençoe essa nova etapa, meus queridos. Amo vocês.');
