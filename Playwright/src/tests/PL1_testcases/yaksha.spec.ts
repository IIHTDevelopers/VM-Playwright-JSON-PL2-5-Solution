import { chromium, test } from "playwright/test";
import { Page, Locator, expect } from "@playwright/test";
import AdminPage from "src/pages/AdminPage";
import LoginPage from "src/pages/LoginPage";
import LeavePage from "src/pages/LeavePage"
import PIMPage from "src/pages/PIMPage";
import * as fs from 'fs';
import * as path from 'path';
import Recruitment from "src/pages/Recruitmentpage";
const downloads = path.resolve(__dirname, '../../downloads');
const data = JSON.parse(JSON.stringify(require("../../Data/login.json")));



test.describe("Yaksha", () => {
  let loginPage: LoginPage;
  let adminPage: AdminPage;
  let PimPage : PIMPage;
  let leavePage : LeavePage
  let recruitment : Recruitment;

  test.beforeEach(async ({ page }, testInfo) => {
    await page.goto("https://yakshahrm.makemylabs.in/orangehrm-5.7");
    loginPage = new LoginPage(page);
    adminPage = new AdminPage(page);
    PimPage = new PIMPage(page);
    leavePage = new LeavePage(page);
    recruitment = new Recruitment(page);
    
    await loginPage.performLogin();
  });






 /**
 * Test Case: TS-1 Verify new User can be created
 *
 * Purpose:
 * Verifies that an admin user is able to successfully add a new user record through the Admin section.
 *
 * Steps:
 * 1. Click on the Admin tab from the main menu.
 * 2. Click the Add button to open the user creation form.
 * 3. Select the appropriate user roles.
 * 4. Enter employee details and auto-suggest a name.
 * 5. Fill in username and confirm password fields.
 * 6. Submit the form and wait for the success toast message.
 * 7. Assert that the returned message confirms the save operation.
 */
test("TS-1 Verify new User can be created", async ({ page }) => {
  const successMessage = await adminPage.AdminAdd();
  await assertSuccessMessageContains(
    successMessage,
    "SuccessSuccessfully Saved×",
    "Admin record added successfully"
  );
});






/**
 * Test Case: TS-2 Verify new User can be created in previous step can perform the login with valid credentials
 *
 * Purpose:
 * Ensures that a newly created user is able to log in successfully and is redirected to the dashboard.
 *
 * Steps:
 * 1. Create a new user using the admin flow.
 * 2. Log out from the current session.
 * 3. Attempt login using the newly created credentials.
 * 4. Assert that the post-login URL matches the expected dashboard URL.
 */

  test("TS-2: Verify new User can be created in previous step can perform the login with valid credentials", async ({page,}) => {
    const commentText = await adminPage.verifyNewUser();
    
    
   expect(commentText).toContain("https://yakshahrm.makemylabs.in/orangehrm-5.7/web/index.php/dashboard/index");
  });





/**
 * Test Case: TS-3 Verify non admin user doesn't have access to 'admin' tab
 *
 * Purpose:
 * Validates that a user with the 'ESS' role does not have visibility of the Admin tab after logging in.
 *
 * Steps:
 * 1. Create a new user with the 'ESS' role.
 * 2. Log out from the current admin session.
 * 3. Log in using the newly created ESS user's credentials.
 * 4. Retrieve all visible tab names from the main menu.
 * 5. Assert that the 'admin' tab is not present in the tab list.
 */

  test("TS-3: Verify non admin user doesn't have access to 'admin' tab", async ({ page }) => {
    const tablist = await adminPage.verifyESS();
    expect(tablist.length).toBeGreaterThan(0);
    expect(tablist).not.toContain("admin")
  });

 



 /**
 * Test Case: TS-4 Verify the non admin user could be upgraded to admin
 *
 * Purpose:
 * Verifies that a user initially created with the 'ESS' role can be successfully upgraded to an 'Admin' role.
 *
 * Steps:
 * 1. Create a new user with the 'ESS' role using a unique username.
 * 2. Edit the newly created user from the admin list.
 * 3. Change their role from 'ESS' to 'Admin'.
 * 4. Save the changes and reload the page.
 * 5. Retrieve the role assigned to the user.
 * 6. Assert that the new role includes "Admin".
 */

  test("TS-4: Verify the non admin user could be upgraded to admin", async ({
    page,
  }) => {
    const name = generateUniqueUsername();
    const Output = await adminPage.upgradeAdmin();
    expect(Output).toContain("Admin");
  });





 /**
 * Test Case: TS-5 Verify the delete selected functionality
 *
 * Purpose:
 * Ensures that an admin can delete a job title successfully using the 'Delete Selected' feature in the Admin > Job Titles section.
 *
 * Steps:
 * 1. Navigates to the Job Titles section under Admin > Job.
 * 2. Adds a new job title entry.
 * 3. Selects the newly added job using the checkbox.
 * 4. Clicks the 'Delete Selected' button and confirms deletion.
 * 5. Asserts that a success toast message appears confirming deletion.
 */

  test("TS-5:Verify the delete selected functionality", async ({ page }) => {
    const jotitle = generateUniquetitle()
   const deleteMsg= await adminPage.deleteJob(jotitle);
    expect(deleteMsg).toContain("Successfully Deleted");
  });





  /**
 * Test Case: TC6 - Verify comment box shows 'Should not exceed 200 characters' when input is too long
 *
 * Purpose:
 * To validate that the application enforces a character limit on the comment input field and displays
 * a proper warning when the limit is exceeded.
 *
 * Steps:
 * 1. Navigate to the Admin > Organization > General Information section.
 * 2. Enable edit mode by clicking the toggle.
 * 3. Enter a comment longer than the allowed character limit (e.g., 290 characters).
 * 4. Capture and verify the displayed validation message.
 *
 * Expected:
 * A validation message like "Should not exceed 255 characters" should be displayed.
 */


  test("TC6 - Verify comment box shows 'Should not exceed 200 characters' when input is too long", async () => {
    const list = await adminPage.inputLimit();
    console.log(list);
    expect(list.length).toBeGreaterThan(0);;
    expect(list).toContain("Should not exceed 255 characters")
  });


 /**
 * Test Case: TS-7 - Verify the sample CSV file gets downloaded successfully
 *
 * Objective:
 * Ensure that clicking the download button on the PIM > Configuration > Data Import page
 * triggers the file download process and that the file is saved locally.
 *
 * Steps:
 * 1. Navigate to PIM > Configuration > Data Import.
 * 2. Click on the "Download Sample CSV" button.
 * 3. Wait for the download event to be triggered.
 * 4. Save the file using the suggested filename.
 * 5. Verify that the file exists in the expected download folder.
 *
 * Expected:
 * The sample CSV file should be downloaded and exist in the downloads directory.
 */

test("TS-7 Verify the sample csv file get downloaded succesfully", async ({ page }) => {
  const DownlodsFiles = await  PimPage.downldCsv();
  const exists = verifyDownloadedFileExists(DownlodsFiles);           // Check if file exists
  expect(exists).toBeTruthy();
  console.log(DownlodsFiles)
});




 /**
 * Test Case: TS-8 - Verify the selected count is displayed correctly
 *
 * Objective:
 * Ensure that when multiple termination options are selected under PIM > Configuration > Termination Reasons,
 * the correct count of selected records is displayed.
 *
 * Steps:
 * 1. Navigate to the PIM section by clicking the PIM link.
 * 2. Go to Configuration > Termination Reasons.
 * 3. Select three termination checkboxes from the list.
 * 4. Retrieve the displayed selected records count.
 * 5. Assert that the count message reflects 3 records selected.
 *
 * Expected:
 * The selected records count should display "(3) Records Selected".
 */

test("TS-8 Verify the selected count is displayed correctly", async ({ page }) => {
  const count = await PimPage.countTermination();
  expect(count).toContain("(3) Records Selected");
});






  /**
 * Test Case: TS-9 - Verify the image gets uploaded
 *
 * Objective:
 * Ensure that an employee image can be successfully uploaded during the Add Employee process.
 *
 * Steps:
 * 1. Navigate to PIM > Add Employee.
 * 2. Upload a profile image using the provided file path.
 * 3. Fill in the required fields (First Name, Last Name, Employee ID).
 * 4. Click Save to submit the employee form.
 * 5. Retrieve the saved employee name text.
 * 6. Verify that the returned name includes the provided first name.
 *
 * Expected:
 * The uploaded image should be accepted, and the employee's first name should appear on the saved profile.
 */

test("TS-9 Verify the image gets uploaded", async ({ page }) => {
 const name = generateUniqueFirstName();
  const firstname = await PimPage.addPIMImage(name); 
const output = firstname.toString().split(" ")[0];
  expect(output).toContain(name);
      
});



/**
 * Test Case: TS-10 - Verify Client Logo could not be uploaded above 1MB
 *
 * Objective:
 * Ensure that the system prevents uploading a company logo image that exceeds 1MB in size.
 *
 * Steps:
 * 1. Navigate to Admin > Corporate Branding section.
 * 2. Attempt to upload a logo image file larger than 1MB.
 * 3. Capture the validation message displayed on the UI.
 * 4. Assert that the correct error message is shown indicating the file size limit.
 *
 * Expected:
 * A validation message should appear, preventing the upload of images larger than 1MB.
 */


test("TS-10 Verify Client Logo could not be uploaded above 1 mb", async ({ page }) => {

  const expectedMessage = await adminPage.companyLogo(); // Perform upload and get the error message

  await assertAttachmentSizeErrorMessage(page, expectedMessage); // Assert error message is correct
});
/**
 * Test Case: TS-11 - Verify Holiday Search Functionality
 *
 * Objective:
 * Ensure that the holiday list is displayed correctly after navigating to the holidays section.
 *
 * Steps:
 * 1. Navigate to the "Leave" section.
 * 2. Click on the "Configure" tab.
 * 3. Click on the "Holidays" option.
 * 4. Click the "Save" or search button to refresh the holiday list.
 * 5. Retrieve all rows from the holiday table.
 * 6. Assert that at least one holiday record is present.
 *
 * Expected:
 * The list should contain at least one holiday, verifying that the holiday search or listing functionality works correctly.
 */


test("TS-11 Verify Holiday Search Functionality", async ({ page }) => {
  const list = await leavePage.holiday(); // returns the style string
  const listCount = list.length;
  expect(listCount).toBeGreaterThan(2); // assert in helper function
});


/**
 * Test Case: TS_12 - Verify the Recruitment link is working fine
 *
 * Objective:
 * Ensure that clicking the "Recruitment" link navigates to the expected Job Vacancy page.
 *
 * Steps:
 * 1. Click on the "Recruitment" main navigation link.
 * 2. Click on the "Vacancy" submenu item.
 * 3. Retrieve the current page URL.
 * 4. Assert that the URL matches the expected Job Vacancy page URL.
 *
 * Expected:
 * The browser should navigate to the correct recruitment job vacancy page URL, confirming the link is functional.
 */

test("TS_12_Verify the Recruitment link is working fine", async ({ page }) => {
  const link = await recruitment.recritmentLink();
  expect(link).toContain("https://yakshahrm.makemylabs.in/orangehrm-5.7/web/index.php/recruitment/viewJobVacancy");

});








/**
 * Test Case: TS-13 - Verify Language Change Functionality
 *
 * Objective:
 * Ensure that changing the language in the Localization settings correctly updates the UI language.
 *
 * Steps:
 * 1. Navigate to Admin > Configuration > Localization.
 * 2. Select a different language from the dropdown (e.g., Chinese).
 * 3. Save the changes.
 * 4. Retrieve the selected language text.
 * 5. Assert that the selected language matches the expected one.
 *
 * Expected:
 * The selected language should be updated and visible in the dropdown, confirming successful language change.
 */

test("TS-13 Verify Language change Functionality", async ({ page }) => {
  const expectedLang = await adminPage.changeLanguage(); // Perform language change
  console.log(expectedLang);

  await assertLanuage(page, expectedLang); // Verify selected language appears correctly
});

  
/**
 * Test Case: TS-14 Verify the 'Maintenance' tab only allows admin to access
 *
 * Purpose:
 * To ensure that access to the Maintenance tab is restricted and only accessible with valid admin credentials.
 *
 * Steps:
 * 1. Click on the Maintenance tab.
 * 2. Enter the admin password to gain access.
 * 3. Confirm the password entry.
 * 4. Verify that the Maintenance page is displayed by checking the page header.
 */
  test("TS-14 Verify Candidate could be Deleted Succesfully", async ({ page }) => {
    const name = generateUniqueFirstName();
    const email = generateUniqueemail();
    const list = await recruitment.deleteCandidate(name,email)
    expect(list.length).toBeGreaterThan(0);
    expect(list).not.toContain(name);
    
  });


/**
 * Test Case: TS-15 Verify Required Field Error in Leaves Tab Displays When Required Field Is Empty
 *
 * Objective:
 * To verify that a validation error message is shown when attempting to assign leave without filling in required fields.
 *
 * Steps:
 * 1. Navigate to the Leave tab and open the Assign Leave section.
 * 2. Click the "Assign" button without entering any values in the form.
 * 3. Capture the displayed validation error message.
 * 4. Assert that the expected error message is shown.
 *
 * Expected:
 * A proper error message (e.g., "Required") should be displayed, indicating that mandatory fields must be filled.
 */


test("TS-15 Verify Required Field Error in Leaves Tab displays when required field is empty", async ({ page }) => {
  const errorMsg = await leavePage.verifyLeaveField(); // Trigger validation and get the error message
  expect(errorMsg).toContain("Required"); // Assert that the error message is as expected

});




});

/**
 * ------------------------------------------------------Helper Methods----------------------------------------------------
 */

async function assertAttachmentSizeErrorMessage(page: Page, expectedMessage: string) {
  const locator = page.locator("span.oxd-text.oxd-text--span.oxd-input-field-error-message.oxd-input-group__message");

  await locator.waitFor({ state: "visible" });
  const actualText = await locator.textContent();

  expect(actualText).toBe(expectedMessage);
}

function generateUniqueUsername(base: string = "TestUser"): string {
  const uniqueSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `${base}${uniqueSuffix}`;
}


function generateUniqueemail(): string {
  const timestamp = Date.now(); // current time in ms
  return `user_${timestamp}_@yyy.com`;
}
function generateUniquetitle(): string {
  const timestamp = Date.now(); // current time in ms
  return `title_${timestamp}`;
}
function verifyDownloadedFileExists(filename: string): boolean {
  const filePath = path.join(downloads, filename);
   const files = fs.readdirSync(downloads); // Get all files in the directory
  return files.includes(filename);
}


export function expectPrimaryColorStyle(actual: string) {
  const expected = "background-color: rgb(130, 97, 55); opacity: 1; cursor: pointer;";
  expect(actual.trim()).toBe(expected);
}

async function assertSearchedEmpId(page: Page, expectedEmpId: string) {
  const displayedEmpId = await page.locator("//div[@class='oxd-table-card']//div[@role='cell']").nth(1).textContent();
  expect(displayedEmpId?.trim()).toBe(expectedEmpId);
}

async function assertEditUserHeaderVisible(page: Page) {
  await expect(page.locator("//h6[text()='Edit User']")).toBeVisible();
}

async function assertCommentExists(postedComment: string, cmntList: string[]) {
  expect(cmntList.some((c) => c.trim() === postedComment.trim())).toBe(true);
}

 async function assertLikeCountIncreased(
  initialNumber: number,
  updatedNumber: number
) {
  expect(updatedNumber).toBeGreaterThan(initialNumber);
}

function generateUniqueFirstName() {
  const timestamp = Date.now(); // current time in milliseconds
  const random = Math.floor(Math.random() * 100); // random 4-digit number
  return `name${random}`;
}

function assertUrlsContainKeywords(urls: string[], keywords: string[]) {
  for (const keyword of keywords) {
    const matched = urls.some(url => url.toLowerCase().includes(keyword.toLowerCase()));
    expect(matched).toBeTruthy();
  }
}

  async function assertUrl(actualUrl: string, expectedUrl: string) {
  expect(actualUrl).toBe(expectedUrl);
  console.log(`Asserted URL: ${actualUrl}`);
}
export async function assertLanuage(page: Page, actualLang: string) {
  expect(actualLang.trim()).toBe("Chinese (Traditional, Taiwan) - 中文（繁體，台灣）");
}




async function assertItemPresentInList(
  listText: string,
  expectedItem: string,
  successMessage: string
) {
  await new Promise((r) => setTimeout(r, 2000));
  expect(listText).toContain(expectedItem);
  console.log(successMessage);
}

async function assertExactErrorMessage(
  actualMessage: string,
  expectedMessage: string,
  logMessage: string
) {
  expect(actualMessage).toBe(expectedMessage);
  console.log(logMessage);
}

async function assertSuccessMessageContains(
  actualMessage: string,
  expectedSubstring: string,
  logMessage: string
) {
  expect(actualMessage).toContain(expectedSubstring);
  console.log(logMessage);
}

async function assertDeletionSuccess(
  actualMessage: string,
  expectedText: string = "Successfully Deleted",
  logMessage: string = "User deleted successfully"
) {
  expect(actualMessage).toContain(expectedText);
  console.log(logMessage);
}






 

