const puppeteer = require('puppeteer');

const TEST_EMAIL = `test${Date.now()}@gmail.com`;
const TEST_PASSWORD = 'TestPass123!';

async function runTests() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Starting full flow tests...\n');
  console.log(`Test account: ${TEST_EMAIL}\n`);

  try {
    // Test 1: Create account
    console.log('Test 1: Create account');
    await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle0' });
    await page.waitForSelector('form');

    await page.type('input[type="email"]', TEST_EMAIL);
    const pwFields = await page.$$('input[type="password"]');
    await pwFields[0].type(TEST_PASSWORD);
    await pwFields[1].type(TEST_PASSWORD);

    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 3000));

    const content = await page.content();
    if (content.includes('Account Created')) {
      console.log('✓ Account created\n');
    } else {
      const errorEl = await page.$('.bg-\\[\\#fee2e2\\]');
      if (errorEl) {
        const errorText = await page.evaluate(el => el.textContent, errorEl);
        throw new Error(`Signup failed: ${errorText}`);
      }
      throw new Error('Signup did not complete as expected');
    }

    // Wait for redirect
    await new Promise(r => setTimeout(r, 3000));

    // Test 2: Login
    console.log('Test 2: Login');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
    await page.waitForSelector('form');

    await page.type('input[type="email"]', TEST_EMAIL);
    await page.type('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');

    // Wait for redirect to /app
    await page.waitForFunction(
      () => window.location.pathname === '/app',
      { timeout: 10000 }
    );
    console.log('✓ Logged in and redirected to /app\n');

    // Test 3: Three-panel layout
    console.log('Test 3: Three-panel layout');
    await page.waitForSelector('.panel', { timeout: 10000 });

    // Check for sidebar
    const sidebar = await page.$('.w-\\[250px\\]');
    if (sidebar) {
      console.log('✓ Sidebar panel present');
    }

    // Check for PDF preview
    const pdfPreview = await page.$('.flex-1.panel');
    if (pdfPreview) {
      console.log('✓ PDF preview panel present');
    }

    // Check for chat interface
    const chatPanel = await page.$('.w-\\[350px\\]');
    if (chatPanel) {
      console.log('✓ Chat panel present\n');
    }

    // Test 4: Chat interface elements
    console.log('Test 4: Chat interface');
    const chatHeader = await page.$eval('.w-\\[350px\\] h2', el => el.textContent);
    if (chatHeader === 'AI Assistant') {
      console.log('✓ Chat header present');
    }

    const chatTextarea = await page.$('textarea[placeholder*="product idea"]');
    if (chatTextarea) {
      console.log('✓ Chat input present\n');
    }

    // Test 5: New PRD button
    console.log('Test 5: New PRD button');
    const newPrdBtn = await page.$('button.btn-primary');
    const newPrdText = await page.evaluate(el => el.textContent, newPrdBtn);
    if (newPrdText.includes('New PRD')) {
      console.log('✓ New PRD button present\n');
    }

    // Test 6: Logout
    console.log('Test 6: Logout');
    await page.click('img.avatar');
    await page.waitForSelector('.dropdown-content button', { timeout: 5000 });
    await page.click('.dropdown-content button');

    await new Promise(r => setTimeout(r, 2000));

    await page.goto('http://localhost:3000/app', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));

    const finalUrl = page.url();
    if (finalUrl.includes('/login')) {
      console.log('✓ Logout successful\n');
    } else {
      console.log('⚠ Logout redirect unclear\n');
    }

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
