import { test, expect } from '@playwright/test';
import ingredientsMock from './data/ingredients.json';
import userMock from './data/user.json';
import orderMock from './data/order.json';

test.describe('Burger Constructor', () => {

  test.beforeEach(async ({ page }) => {
    await page.route('**/api/ingredients', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ingredientsMock),
      });
    });

    await page.goto('/');
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();
  });

  // Добавление ингредиентов
  test('Добавить булку и начинку в конструктор', async ({ page }) => {
    const bunCard = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      page.locator('[class*="constructor-element"]').filter({ hasText: 'Краторная булка N-200i (верх)' }).first()
    ).toBeVisible();

    const fillingCard = page.locator('li').filter({ hasText: 'Филе Люминесцентного тетраодонтимформа' });
    await fillingCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      page.locator('span').filter({ hasText: 'Филе Люминесцентного тетраодонтимформа' }).first()
    ).toBeVisible();

    const sauceCard = page.locator('li').filter({ hasText: 'Соус Spicy-X' });
    await sauceCard.getByRole('button', { name: 'Добавить' }).click();
    await expect(
      page.locator('span').filter({ hasText: 'Соус Spicy-X' }).first()
    ).toBeVisible();

    await expect(page.locator('main').getByText('3474').first()).toBeVisible();
  });

  // Открытие модального окна ингредиента
  test('Открыть модальное окно ингредиента при клике на карточку', async ({ page }) => {
    await page.locator('li').filter({ hasText: 'Краторная булка N-200i' })
      .getByRole('link')
      .click();

    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Краторная булка N-200i' })).toBeVisible();
    await expect(page.getByText('Калории, ккал')).toBeVisible();
    await expect(page.getByText('420')).toBeVisible();
  });

  // Закрытие по клику на крестик
  test('Закрыть модальное окно по клику на крестик', async ({ page }) => {
    await page.locator('li').filter({ hasText: 'Филе Люминесцентного тетраодонтимформа' })
      .getByRole('link')
      .click();

    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible();

    await page.locator('#modals')
      .locator('button')
      .filter({ has: page.locator('img, svg').first() })
      .first()
      .click({ force: true });

    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).not.toBeVisible();
    await expect(page).toHaveURL('/');
  });

  // Закрытие по клику на оверлей
  test('Закрыть модальное окно по клику на оверлей', async ({ page }) => {
    await page.locator('li').filter({ hasText: 'Филе Люминесцентного тетраодонтимформа' })
      .getByRole('link')
      .click();

    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible();

    const viewport = page.viewportSize()!;
    await page.mouse.click(viewport.width - 20, viewport.height - 20);

    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).not.toBeVisible();
    await expect(page).toHaveURL('/');
  });

  // Создание заказа
  test('Cоздание заказа: сборка -> оформление -> проверка -> очистка конструктора', async ({ context, page }) => {
    // 1. Подставляем моковые токены авторизации
    await context.addCookies([{
      name: 'accessToken',
      value: 'mock-access-token-xyz',
      domain: 'localhost',
      path: '/'
    }]);
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token-xyz');
    });

    // 2. Настраиваем перехваты запросов
    await page.route('**/api/ingredients', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ingredientsMock) }));

    await page.route('**/api/auth/user', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(userMock) }));

    await page.route('**/api/orders', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(orderMock)
        });
      } else {
        route.continue();
      }
    });

    // 3. Открываем главную страницу
    await page.goto('/');
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();

    // 4. Собирается бургер
    await page.locator('li').filter({ hasText: 'Краторная булка N-200i' })
      .getByRole('button', { name: 'Добавить' }).click();
    await expect(
      page.locator('[class*="constructor-element"]').filter({ hasText: '(верх)' }).first()
    ).toBeVisible();

    await page.locator('li').filter({ hasText: 'Филе Люминесцентного тетраодонтимформа' })
      .getByRole('button', { name: 'Добавить' }).click();
    await expect(
      page.locator('span').filter({ hasText: 'Филе Люминесцентного тетраодонтимформа' }).first()
    ).toBeVisible();

    // 5. Вызывается клик по кнопке «Оформить заказ»
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    // 6. Проверяется, что модальное окно открылось
    await expect(page.getByText('идентификатор заказа')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Ваш заказ начали готовить')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(orderMock.order.number.toString())).toBeVisible();

    // 7. Закрывается модальное окно
    if (await page.locator('[data-testid="modal-overlay"]').count() > 0) {
      await page.locator('[data-testid="modal-overlay"]').first().click({ force: true });
    } else if (await page.locator('button[aria-label="Закрыть"]').count() > 0) {
      await page.locator('button[aria-label="Закрыть"]').first().click();
    } else {
      const viewport = page.viewportSize()!;
      await page.mouse.click(viewport.width - 20, viewport.height - 20);
    }

    await page.waitForTimeout(500);
    await expect(page.getByText('идентификатор заказа')).not.toBeVisible();

    // 8. Проверяется, что конструктор пуст
    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    const constructorList = page.locator('[class*="elements"]').locator('li');
    await expect(constructorList).toHaveCount(0);
  });

});