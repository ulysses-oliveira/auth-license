-- Remover tabelas existentes
DROP TABLE IF EXISTS verification_codes;
DROP TABLE IF EXISTS licenses;
DROP TABLE IF EXISTS users;

-- Remover tipos enum
DROP TYPE IF EXISTS license_status;
DROP TYPE IF EXISTS user_role; 