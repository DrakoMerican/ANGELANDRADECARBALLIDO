
const { test, expect } = require('@playwright/test');

const FORM_URL = 'http://localhost:5500'; 

test.describe('Pruebas del formulario de contacto', () => {

  test('Prueba válida: enviar formulario con datos correctos', async ({ page }) => {
    await page.goto(FORM_URL);

    await page.fill('#nombre', 'Juan Pérez');
    await page.fill('#email', 'juan@example.com');
    await page.fill('#mensaje', 'Este es un mensaje válido.');

    await page.click('button[type="submit"]');
    
    await expect(page.locator('form')).toHaveClass(/was-validated/);

    const invalidFields = await page.locator('.form-control:invalid');
    await expect(invalidFields).toHaveCount(0);
  });

  test('Prueba inválida: intentar enviar formulario vacío', async ({ page }) => {
    await page.goto(FORM_URL);

    await page.click('button[type="submit"]');

    await expect(page.locator('form')).toHaveClass(/was-validated/);

    const invalidFields = await page.locator('.form-control:invalid');
    await expect(invalidFields).toHaveCount(3);

    await expect(page.locator('#nombre + .invalid-feedback')).toBeVisible();
    await expect(page.locator('#email + .invalid-feedback')).toBeVisible();
    await expect(page.locator('#mensaje + .invalid-feedback')).toBeVisible();
  });
});
