// playwright-form-test.spec.js
const { test, expect } = require('@playwright/test');

// URL del formulario que debes ajustar a tu entorno local o remoto
const FORM_URL = 'http://localhost:5500'; // Reemplaza con la URL donde se sirve tu HTML

test.describe('Pruebas del formulario de contacto', () => {

  test('Prueba válida: enviar formulario con datos correctos', async ({ page }) => {
    await page.goto(FORM_URL);

    await page.fill('#nombre', 'Juan Pérez');
    await page.fill('#email', 'juan@example.com');
    await page.fill('#mensaje', 'Este es un mensaje válido.');

    await page.click('button[type="submit"]');

    // Verifica que la clase 'was-validated' se haya aplicado al formulario
    await expect(page.locator('form')).toHaveClass(/was-validated/);

    // No debe haber campos inválidos después de una entrada válida
    const invalidFields = await page.locator('.form-control:invalid');
    await expect(invalidFields).toHaveCount(0);
  });

  test('Prueba inválida: intentar enviar formulario vacío', async ({ page }) => {
    await page.goto(FORM_URL);

    await page.click('button[type="submit"]');

    // Verifica que la clase 'was-validated' se haya aplicado al formulario
    await expect(page.locator('form')).toHaveClass(/was-validated/);

    // Verifica que existan campos inválidos
    const invalidFields = await page.locator('.form-control:invalid');
    await expect(invalidFields).toHaveCount(3); // nombre, email, mensaje

    // Verifica que se muestren los mensajes de error
    await expect(page.locator('#nombre + .invalid-feedback')).toBeVisible();
    await expect(page.locator('#email + .invalid-feedback')).toBeVisible();
    await expect(page.locator('#mensaje + .invalid-feedback')).toBeVisible();
  });
});
