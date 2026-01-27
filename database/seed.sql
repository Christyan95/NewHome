
-- Limpar tabela existente (opcional, comente se não quiser perder dados antigos)
TRUNCATE TABLE myhome_products;

-- Inserir produtos
INSERT INTO myhome_products (id, name, category, image, total_value, total_quotas, sold_quotas, active) VALUES
('0c653244-50c0-4c70-8370-07f60a64369e', 'TV', 'Sala', 'https://http2.mlstatic.com/D_NQ_NP_2X_715551-MLA103757527265_012026-F.webp', 2463.00, 10, 0, true),
('1e124255-d91b-40a6-b365-a832c5b07f67', 'Sofá', 'Sala', 'https://http2.mlstatic.com/D_NQ_NP_2X_618856-MLU76438748286_052024-F.webp', 2209.00, 10, 3, true),
('51c15fdc-94d7-45b9-9229-75f92b376a4e', 'Cooktop', 'Cozinha', 'https://http2.mlstatic.com/D_NQ_NP_2X_646526-MLA99998165633_112025-F.webp', 307.00, 10, 0, true),
('5b37810e-68de-40a2-a055-e12dba9faa2b', 'Fritadeira Elétrica', 'Cozinha', 'https://http2.mlstatic.com/D_NQ_NP_2X_720182-MLA100247452907_122025-F.webp', 549.00, 2, 0, true),
('74c72947-c913-4fd4-bdeb-a2565f129127', 'Micro-ondas', 'Cozinha', 'https://http2.mlstatic.com/D_NQ_NP_2X_717275-MLA100007772939_122025-F.webp', 594.00, 2, 0, true),
('7defdd66-e213-416d-b2a2-7eeaf5ae588c', 'Geladeira', 'Cozinha', 'https://http2.mlstatic.com/D_NQ_NP_2X_661748-MLA96659392837_102025-F.webp', 2599.00, 10, 1, true),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Cama', 'Quarto', '', 1899.00, 10, 0, true),
('b2c3d4e5-f678-9012-3456-789012abcdef', 'Guarda-Roupa', 'Quarto', '', 1450.00, 10, 0, true),
('c3d4e5f6-7890-1234-5678-901234abcdef', 'Mesa', 'Sala', '', 1200.00, 5, 0, true),
('d4e5f678-9012-3456-7890-123456abcdef', 'Cadeiras', 'Sala', '', 800.00, 4, 0, true),
('e5f67890-1234-5678-9012-345678abcdef', 'Lavadora', 'Outros', '', 2100.00, 10, 0, true),
('f6789012-3456-7890-1234-567890abcdef', 'Ferro', 'Outros', '', 150.00, 1, 0, true),
('01234567-89ab-cdef-0123-456789abcdef', 'Aspirador', 'Outros', '', 350.00, 2, 0, true),
('12345678-9abc-def0-1234-567890abcdef', 'Liquidificador', 'Cozinha', '', 130.00, 1, 0, true),
('23456789-abcdef-0123-4567-89abcdef01', 'Batedeira', 'Cozinha', '', 190.00, 1, 0, true),
('3456789a-bcde-f012-3456-789abcdef012', 'Panelas', 'Cozinha', '', 450.00, 2, 0, true),
('456789ab-cdef-0123-4567-89abcdef0123', 'Pratos', 'Cozinha', '', 250.00, 1, 0, true),
('56789abc-def0-1234-5678-9abcdef01234', 'Talheres', 'Cozinha', '', 150.00, 1, 0, true),
('6789abcd-ef01-2345-6789-abcdef012345', 'Lençóis', 'Quarto', '', 220.00, 1, 0, true),
('789abcde-f012-3456-7890-bcdef0123456', 'Travesseiros', 'Quarto', '', 100.00, 1, 0, true),
('89abcdef-0123-4567-89ab-cdef01234567', 'Toalhas', 'Outros', '', 180.00, 1, 0, true),
('9abcdef0-1234-5678-9abc-def012345678', 'Tapete', 'Sala', '', 250.00, 1, 0, true),
('abcdef01-2345-6789-abcd-ef0123456789', 'Abajur', 'Quarto', '', 120.00, 1, 0, true),
('bcdef012-3456-7890-abcde-f01234567890', 'Espelho', 'Sala', '', 300.00, 2, 0, true);
