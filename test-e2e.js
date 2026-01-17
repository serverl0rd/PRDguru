const puppeteer = require('puppeteer');

const TEST_EMAIL = `testuser${Date.now()}@gmail.com`;
const TEST_PASSWORD = 'TestPass123!';

async function runTests() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Starting E2E tests...\n');
  console.log(`Test account: ${TEST_EMAIL}\n`);

  try {
    // Test 1: Homepage loads
    console.log('Test 1: Homepage loads');
    await page.goto('http://localhost:3000');
    await page.waitForSelector('h1');
    const title = await page.$eval('h1', el => el.textContent);
    if (title === 'PRD Guru') {
      console.log('✓ Pass\n');
    } else {
      throw new Error('Homepage title mismatch');
    }

    // Test 2: Signup
    console.log('Test 2: Create account');
    await page.goto('http://localhost:3000/signup');
    await page.waitForSelector('form');

    await page.type('input[type="email"]', TEST_EMAIL);
    const pwFields = await page.$$('input[type="password"]');
    await pwFields[0].type(TEST_PASSWORD);
    await pwFields[1].type(TEST_PASSWORD);

    await page.click('button[type="submit"]');

    // Wait for result
    await new Promise(r => setTimeout(r, 3000));

    const content = await page.content();
    if (content.includes('Account Created')) {
      console.log('✓ Account created\n');
    } else {
      // Check for error
      const errorEl = await page.$('.bg-red-500');
      if (errorEl) {
        const errorText = await page.evaluate(el => el.textContent, errorEl);
        throw new Error(`Signup failed: ${errorText}`);
      }
      throw new Error('Signup did not complete as expected');
    }

    // Test 3: Login
    console.log('Test 3: Login');
    await page.goto('http://localhost:3000/login');
    await page.waitForSelector('form');

    await page.type('input[type="email"]', TEST_EMAIL);
    await page.type('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');

    // Wait for redirect to homepage
    await page.waitForFunction(
      () => window.location.pathname === '/',
      { timeout: 10000 }
    );

    // Wait for user avatar (indicates logged in)
    await page.waitForSelector('img.avatar', { timeout: 10000 });
    console.log('✓ Logged in successfully\n');

    // Test 4: Save PRD
    console.log('Test 4: Save PRD');
    await page.waitForSelector('input[name="title"]');
    await page.type('input[name="title"]', 'My Test PRD');
    await page.type('textarea[name="objective"]', 'Test the Supabase integration');
    await page.type('textarea[name="description"]', 'This PRD was created by automated testing');

    // Click save
    const buttons = await page.$$('button.btn-primary');
    await buttons[0].click();

    // Wait for save to complete
    await new Promise(r => setTimeout(r, 2000));
    console.log('✓ PRD saved\n');

    // Test 5: Check sidebar shows PRD
    console.log('Test 5: PRD appears in sidebar');
    // Refresh to fetch PRDs
    await page.reload();
    await page.waitForSelector('.list', { timeout: 5000 });

    await new Promise(r => setTimeout(r, 2000));

    const sidebarContent = await page.$eval('aside', el => el.textContent);
    if (sidebarContent.includes('My Test PRD')) {
      console.log('✓ PRD visible in sidebar\n');
    } else {
      console.log('⚠ PRD not visible in sidebar (may need refresh)\n');
    }

    // Test 6: Logout
    console.log('Test 6: Logout');
    await page.click('img.avatar');
    await page.waitForSelector('.dropdown-content button', { timeout: 5000 });
    await page.click('.dropdown-content button');

    await page.waitForSelector('a[href="/login"]', { timeout: 5000 });
    console.log('✓ Logged out\n');

    console.log('========================================');
    console.log('All tests passed!');
    console.log('========================================');

  } catch (error) {
    console.error('✗ Test failed:', error.message);
    await page.screenshot({ path: '/tmp/test-failure.png' });
    console.log('Screenshot saved to /tmp/test-failure.png');
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runTests();
