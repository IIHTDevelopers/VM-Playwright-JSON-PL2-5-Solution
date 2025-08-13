import { Page, Locator, expect, Download } from "@playwright/test";
import * as fs from 'fs';
import * as path from 'path';
const downloadDir = path.resolve(__dirname, '../downloads');
const filePath = path.resolve(__dirname, '../../CompanyLogo.png');

export default class AdminPage {
  readonly page: Page;
  private seachBtn: Locator;
  private option: Locator;
  private optionEng: Locator;
  private langDropdown: Locator;
  private langSaveBtn: Locator;
  private localizationBtn: Locator;
  private textarea: Locator;
  private editToggle: Locator;
  private OrgGenrl: Locator;
  private Orgtab: Locator;
  private confirmDel: Locator;
  private deleteAllBtn: Locator;
  private checkBox: Locator;
  private saveBtn: Locator;
  private jobInput: Locator;
  private addJobbtn: Locator;
  private jobTitle: Locator;
  private jobTab: Locator;
  private logoutBtn: Locator;
  private profiletab: Locator;
  private searchInput: Locator;

  private configTab: Locator;

  private AdminLink: Locator;
  private userName: Locator;

  private crpTab: Locator;

  private AddButton: Locator;
  private userRole: Locator;
  private empName: Locator;
  private confirmPassword: Locator;
  private empNameSubmit: Locator;
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private logoInput: Locator;
  private logoMsg: Locator;





  constructor(page: Page) {
    this.page = page;
    this.seachBtn = page.locator("//button[text()=' Search ']");
    this.searchInput = page.locator("//input[@class='oxd-input oxd-input--active']");
    this.logoInput = this.page.locator("//input[@type='file']");
    this.logoMsg = this.page.locator("span.oxd-text.oxd-text--span.oxd-input-field-error-message.oxd-input-group__message");
    this.textarea = page.locator("textarea.oxd-textarea");
    this.editToggle = page.locator("//label[text()='Edit']");
    this.OrgGenrl = page.locator("//a[text()='General Information']");
    this.Orgtab = page.locator("//span[text()='Organization ']");
    this.confirmDel = page.locator("//button[text()=' Yes, Delete ']");
    this.deleteAllBtn = page.locator("//button[text()=' Delete Selected ']");
    this.checkBox = page.locator("span.oxd-checkbox-input");
    this.saveBtn = page.locator("//button[text()=' Save ']");
    this.jobInput = page.locator("//input[@class='oxd-input oxd-input--active']");
    this.addJobbtn = page.locator("//button[text()=' Add ']");
    this.jobTitle = page.locator("//a[text()='Job Titles']");
    this.jobTab = page.locator("//span[text()='Job ']");
    this.loginButton = page.locator("//button[@type='submit']");
    this.usernameInput = page.locator("//input[@placeholder='username' or @placeholder='Username']");
    this.passwordInput = page.locator("//input[@placeholder='password' or @placeholder='Password']");
    this.loginButton = page.locator("//button[@type='submit']");
    this.logoutBtn = page.locator("//a[text()='Logout']");
    this.profiletab = page.locator("i.oxd-userdropdown-icon");
    this.confirmPassword = page.locator("//input[@type='password']");
    this.empNameSubmit = page.locator("button[type='submit']");
    this.empName = page.locator('//input[@placeholder="Type for hints..."]');
    this.userRole = page.locator("//div[@class='oxd-select-text oxd-select-text--active']");
    this.AddButton = page.locator("//div[@class='orangehrm-header-container']/button");
    this.configTab = page.locator("//span[text()='Configuration ']");
    this.crpTab = page.locator("//a[text()='Corporate Branding']");
    this.configTab = page.locator("//span[text()='Configuration ']");
    this.AdminLink = page.locator("//span[text()='Admin']");
    this.userName = page.locator("//input[@autocomplete='off']");
    this.langSaveBtn = this.page.locator("//button[text()=' Save ' or text()=' 儲存 ']")
    this.option = this.page.locator("//div[@role='listbox']//span[contains(normalize-space(), 'Chinese (Traditional')]")
    this.optionEng = this.page.locator("//div[@role='listbox']//span[contains(normalize-space(), 'English (United States')]")
    this.langDropdown = this.page.locator("//div[@class='oxd-select-text oxd-select-text--active']");
    this.localizationBtn = this.page.locator("//a[text()='Localization']");
    this.crpTab = page.locator("//a[text()='Corporate Branding']");
    this.configTab = page.locator("//span[text()='Configuration ']");

  }








  /**
   * Adds a new admin user via the Admin section form.
   *
   * Navigates through the Admin tab, selects user roles, fills required fields,
   * handles employee name auto-suggestion, and submits the form. Finally,
   * waits for the toast notification and returns the message for validation.
   *
   * @returns {Promise<string>} The trimmed toast success message after form submission.
   */

  public async AdminAdd() {
    await this.AdminLink.click();
    await this.AddButton.waitFor({ state: 'visible' });
    await this.AddButton.click();
    await this.userRole.nth(0).click();
    const adminRoleOption = this.page.locator('//div[@role= "listbox"]');
    await adminRoleOption.click();
    await this.userRole.nth(1).click();
    const UserRoleOption = this.page.locator('//div[@role= "listbox"][1]');
    await UserRoleOption.click();
    await this.empName
      .clear()
      .then(() => this.empName.fill("a"))
      .then(() => this.empName.click());
    await this.page.waitForTimeout(3000); // Wait for the dropdown to appear
    const empseletion = this.page.locator(".oxd-autocomplete-dropdown");
    await empseletion.click();
    await this.userName.nth(0).fill(generateUniqueUsername());
    await this.confirmPassword.nth(0).fill("Testaa@123");
    await this.confirmPassword.nth(1).fill("Testaa@123");
    await this.empNameSubmit.click();
    await this.page.waitForTimeout(1500); // Wait for the success message to appear
    const addsuccessMessage = await this.page
      .locator(".oxd-toast")
      .textContent();
    return addsuccessMessage?.trim() || "";
    return "";
  }




  /**
 * Creates a new user and verifies that the user can successfully log in.
 *
 * Navigates to the Admin tab, fills out the user creation form, selects roles,
 * handles employee autocomplete, submits the form, logs out, and attempts login
 * with the new credentials. Finally, it returns the current page URL post-login
 * for validation purposes.
 *
 * @returns {Promise<string>} The URL of the page after successful login.
 */


  async verifyNewUser() {
    await this.AdminLink.click();
    await this.AddButton.waitFor({ state: 'visible' });
    await this.AddButton.click();
    await this.userRole.nth(0).click();
    const adminRoleOption = this.page.locator('//div[@role= "listbox"]');
    await adminRoleOption.click();
    // await this.page.locator('//div[@role="option" and text()="Admin"]').click();
    await this.userRole.nth(1).click();
    const UserRoleOption = this.page.locator('//div[@role= "listbox"][1]');
    await UserRoleOption.click();
    await this.empName
      .clear()
      .then(() => this.empName.fill("a"))
      .then(() => this.empName.click());
    await this.page.waitForTimeout(3000); // Wait for the dropdown to appear
    const empseletion = this.page.locator(".oxd-autocomplete-dropdown");
    await empseletion.click();
    const usernamee = generateUniqueUsername();
    await this.userName.nth(0).fill(usernamee);
    await this.confirmPassword.nth(0).fill("Testaa@123");
    await this.confirmPassword.nth(1).fill("Testaa@123");
    await this.empNameSubmit.click();
    await this.page.waitForTimeout(2500); // Wait for the success message to appear
    await this.profiletab.click();
    await this.logoutBtn.click();
    await this.usernameInput.fill(usernamee);
    await this.passwordInput.fill("Testaa@123");
    await this.loginButton.click();
    await this.page.waitForTimeout(3000);
    return  this.page.url()



  }





  /**
 * Creates a new user with the 'ESS' role and verifies restricted access.
 *
 * This method:
 * - Navigates to the Admin panel and initiates user creation
 * - Assigns the 'ESS' role and a random employee from the autocomplete
 * - Generates a unique username and sets a predefined password
 * - Submits the form and logs out from the current session
 * - Logs in using the newly created ESS user credentials
 * - Retrieves and returns the list of visible main menu tabs
 *
 * @returns {Promise<string[]>} A list of tab names visible to the ESS user
 */

  async verifyESS() {
    await this.AdminLink.click();
    await this.AddButton.waitFor({ state: 'visible' });
    await this.AddButton.click();
    await this.userRole.nth(0).click();
    const adminRoleOption = this.page.locator('//div[@role= "listbox"]/div[3]');
    await adminRoleOption.click();
    //await this.page.locator('//div[@role="option" and text()="ESS"]').click();
    await this.userRole.nth(1).click();
    const UserRoleOption = this.page.locator('//div[@role= "listbox"][1]');
    await UserRoleOption.click();
    await this.empName
      .clear()
      .then(() => this.empName.fill("a"))
      .then(() => this.empName.click());
    await this.page.waitForTimeout(3000); // Wait for the dropdown to appear
    const empseletion = this.page.locator(".oxd-autocomplete-dropdown");
    await empseletion.click();
    const usernamee = generateUniqueUsername();
    await this.userName.nth(0).fill(usernamee);
    await this.confirmPassword.nth(0).fill("Testaa@123");
    await this.confirmPassword.nth(1).fill("Testaa@123");
    await this.empNameSubmit.click();
    await this.page.waitForTimeout(2500); // Wait for the success message to appear
    await this.profiletab.click();
    await this.logoutBtn.click();
    await this.usernameInput.fill(usernamee);
    await this.passwordInput.fill("Testaa@123");
    await this.loginButton.click();
    await this.page.waitForTimeout(3000);
    return this.page.locator("a.oxd-main-menu-item").allInnerTexts();



  }



  /**
 * Adds and deletes a job title using the 'Delete Selected' functionality.
 *
 * This method performs the following actions:
 * - Navigates to the Admin > Job > Job Titles section
 * - Adds a new job title named 'jobtitleee'
 * - Selects the first job title entry using a checkbox
 * - Clicks the 'Delete Selected' button and confirms the deletion
 * - Returns the success toast message text for assertion
 *
 * @returns {Promise<string>} The success message displayed after deletion
 */


  async deleteJob(jobtitleee: string) {
    await this.AdminLink.click();
    await this.page.waitForTimeout(2500);
    await this.jobTab.click();
    await this.jobTitle.click();
    await this.addJobbtn.click();
    await this.jobInput.nth(1).fill(jobtitleee);
    await this.saveBtn.click();
    await this.checkBox.nth(0).waitFor({ state: 'visible' });
    await this.page.waitForTimeout(1000);
    
    await this.checkBox.nth(0).click();
    await this.deleteAllBtn.click();
    await this.confirmDel.click();
    await this.page.waitForTimeout(1000);

    return await this.page.locator("div.oxd-toast-container").innerText();



  }





  /**
 * Inputs an overly long comment in the organization general information section to trigger validation.
 *
 * Actions performed:
 * - Navigates to Admin > Organization > General Information.
 * - Enables edit mode using the toggle switch.
 * - Fills the comment box with a string exceeding 255 characters.
 * - Waits for the validation message to appear.
 * - Returns the displayed error message text for assertion.
 *
 * @returns {Promise<string>} The validation message shown for exceeding character limit.
 */

  async inputLimit() {
    await this.AdminLink.click();
    await this.page.waitForTimeout(2000);
    await this.Orgtab.click();
    await this.OrgGenrl.click();
    await this.editToggle.click();
    await this.page.waitForTimeout(2000);
    const a = "A".repeat(290);
    await this.textarea.fill(a);
    await this.page.waitForTimeout(2000);
     return this.page.locator("span.oxd-input-field-error-message ").innerText();

  }




  /**
 * Creates a new ESS user and upgrades their role to Admin.
 *
 * This method performs the following actions:
 * - Creates a user with the 'ESS' role and provided username
 * - Submits the user creation form
 * - Locates the newly created ESS user in the admin table
 * - Edits the user's role from 'ESS' to 'Admin'
 * - Saves the updated role and reloads the page
 * - Extracts and returns the updated role text of the user for verification
 *
 * @param {string} usernamee - The unique username to be assigned during user creation
 * @returns {Promise<string>} The role label text associated with the updated user
 */


  async upgradeAdmin() {
    await this.AdminLink.click();
   
    const essRow = await this.page.locator("//div[contains(@class,'oxd-table-row') and contains(. , 'ESS')]");
    const usernamee = await essRow.nth(1).locator("//div[2]").innerText();
    await essRow.locator("//i[contains(@class,'oxd-icon bi-pencil-fill')]").nth(1).click();
    
    await this.userRole.nth(0).click();
    const adminRoleOptioon = this.page.locator('//div[@role= "listbox"]/div[2]');
    await adminRoleOptioon.click();
    await this.empNameSubmit.click();
    await this.page.waitForTimeout(8000);
    await this.searchInput.nth(1).waitFor({ state: 'visible' });
    await this.searchInput.nth(1).fill(await usernamee);
    await this.seachBtn.click();
    await this.page.locator(`//div[contains(@class,'oxd-table-row') and contains(., '${usernamee}')]/div[3]`).waitFor({ state: 'visible' });
return await this.page.locator(`//div[contains(@class,'oxd-table-row') and contains(., '${usernamee}')]/div[3]`).innerText();


   



  }




  /**
   * Changes the application language via Admin > Configuration > Localization and returns the selected language.
   *
   * Steps performed:
   * - Navigates to the Admin section.
   * - Clicks on the Configuration > Localization tab.
   * - Opens the language dropdown and selects the first language option.
   * - Saves the language change.
   * - Retrieves the updated selected language text.
   * - Resets the language back to English.
   *
   * @returns {Promise<string>} The text content of the newly selected language (e.g., "中文").
   */

  async changeLanguage(): Promise<string> {
    await this.AdminLink.nth(0).click();
    await this.page.waitForTimeout(2000);

    await this.configTab.click();
    await this.localizationBtn.click();

    await this.langDropdown.nth(0).click();
    await this.option.nth(0).waitFor({ state: 'visible' });
    await this.option.nth(0).click(); // Select first option (e.g., 中文)

    await this.langSaveBtn.click();

    const lang = await this.page.locator("//div[@class='oxd-select-text-input']").nth(0).textContent();

    // Reset back to English
    await this.langDropdown.nth(0).click();
    await this.optionEng.click();
    await this.langSaveBtn.click();

    await this.page.waitForTimeout(2000);

    return lang !== null ? lang : "";
  }




  /**
   * Attempts to upload a company logo file larger than 1MB and retrieves the validation message.
   *
   * Steps performed:
   * - Navigates to Admin > Corporate Branding section.
   * - Uploads an image file exceeding 1MB via the logo input.
   * - Captures the validation error message from the UI.
   *
   * @returns {Promise<string>} The validation message displayed after attempting the upload.
   */

  async companyLogo(): Promise<string> {
    await this.AdminLink.nth(0).click();
    await this.page.waitForTimeout(2000);

    await this.crpTab.click();
    await this.page.waitForTimeout(2000);

    await this.logoInput.nth(0).setInputFiles(filePath); // Upload logo file (>1MB)

    const msg = await this.logoMsg.textContent(); // Get validation message
    return msg ?? "";
  }

}


function generateUniqueUsername(base: string = "TestUser"): string {
  const uniqueSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `${base}${uniqueSuffix}`;
}


function ensureDownloadFolder() {
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir)
  }
}

