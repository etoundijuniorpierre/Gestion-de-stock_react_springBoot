-- Clear any existing data for clean test environment
DELETE FROM roles;
DELETE FROM utilisateur;
DELETE FROM entreprise;

-- Insert a test enterprise
INSERT INTO entreprise (id, nom, description, codefiscal, photo, email, numtel, adresse_rue, adresse_ville, adresse_pays, adresse_codepostal)
VALUES (1, 'Test Enterprise', 'Test Enterprise Description', 'TEST123', 'test.jpg', 'enterprise@test.com', '123456789',
        '123 Test St', 'Test City', 'Test Country', '12345');