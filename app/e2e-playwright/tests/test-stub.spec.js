const { test, expect } = require("@playwright/test");

test("On main page there should be courses, Programming1, Web software development and Databases", async ({ page }) => {
  await page.goto("/"); 

  await page.waitForLoadState('networkidle'); 
  const mainPageText = await page.textContent('body');  

  expect(mainPageText).toContain('Programming 1');
  expect(mainPageText).toContain('Web Software Development');
  expect(mainPageText).toContain('Databases');
});

test("User can add question to the course", async ({ page }) => {
  await page.goto("/course/1");

  await page.getByRole('textbox').fill('What is programming?');
  await page.locator('button:text("Add")').click();

  const notification = await (await page.waitForSelector('[class*="notification"]')).textContent();

  expect(notification).toBe("Added new question: What is programming?");
});

test("User can vote question only once", async ({ page }) => {
  await page.goto("/course/1");

  const firstItem = await page.waitForSelector('ul > li:first-child');
  
  const text = await firstItem.innerText(); 
  const matches = text.match(/Votes: (\d+)/); 
  const votes = parseInt(matches[1]);
  
  await page.locator(':nth-match(:text("Vote"), 1)').click();
  

  const notification = await (await page.waitForSelector('[class*="notification"]')).textContent();
  expect(notification).toBe("Question voted!");

  const newFirstItem = await page.waitForSelector('ul > li:first-child');

  const newText = await newFirstItem.innerText(); 
  const newMatches = newText.match(/Votes: (\d+)/); 
  const newVotes = parseInt(newMatches[1]);

  expect(newVotes).toBe(votes + 1);

  await page.waitForTimeout(5000); 

  await page.locator(':nth-match(:text("Vote"), 1)').click();

  const notification2 = await (await page.waitForSelector('[class*="notification"]')).textContent();
  expect(notification2).toBe("You have already voted this question");

  const secondFirstItem = await page.waitForSelector('ul > li:first-child');

  const secondText = await secondFirstItem.innerText(); 
  const secondMatches = secondText.match(/Votes: (\d+)/); 
  const secondVotes = parseInt(secondMatches[1]);

  expect(secondVotes).toBe(newVotes);
});

test("User can add answer to the question", async ({ page }) => {
  await page.goto("/course/1/question/1");

  await page.getByRole('textbox').fill('Test');
  await page.locator('button:text("Add")').click();

  const notification = await (await page.waitForSelector('[class*="notification"]')).textContent();

  expect(notification).toBe("Added new answer: Test");
});

test("User can vote answer only once", async ({ page }) => {
  await page.goto("/course/1/question/1");

  const firstItem = await page.waitForSelector('ul > li:first-child');
  
  const text = await firstItem.innerText(); 
  const matches = text.match(/Votes: (\d+)/); 
  const votes = parseInt(matches[1]);
  
  await page.locator(':nth-match(:text("Vote"), 1)').click();
  

  const notification = await (await page.waitForSelector('[class*="notification"]')).textContent();
  expect(notification).toBe("Answer voted!");

  const newFirstItem = await page.waitForSelector('ul > li:first-child');

  const newText = await newFirstItem.innerText(); 
  const newMatches = newText.match(/Votes: (\d+)/); 
  const newVotes = parseInt(newMatches[1]);

  expect(newVotes).toBe(votes + 1);

  await page.waitForTimeout(5000); 

  await page.locator(':nth-match(:text("Vote"), 1)').click();

  const notification2 = await (await page.waitForSelector('[class*="notification"]')).textContent();
  expect(notification2).toBe("You have already voted this answer");

  const secondFirstItem = await page.waitForSelector('ul > li:first-child');

  const secondText = await secondFirstItem.innerText(); 
  const secondMatches = secondText.match(/Votes: (\d+)/); 
  const secondVotes = parseInt(secondMatches[1]);

  expect(secondVotes).toBe(newVotes);
});
