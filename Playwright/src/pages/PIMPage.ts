import { Page, Locator, expect } from "@playwright/test";
import { assert } from "console";
import * as path from 'path';
import * as fs from 'fs';
const downloadDir = path.resolve(__dirname, '../downloads');
const filePath = path.resolve(__dirname,'../../TestImage.jpg')
export default class PIMPage {
  readonly page: Page;
  private empId :Locator;
  private saveBtn : Locator;
  private firstName :Locator;
  private lastName : Locator;
  private addImg : Locator;
  private addEmpTab : Locator;
  private terminationTab : Locator;
  private dataImp: Locator;
  private trmintnChkBtn :Locator;
  private PIMLink: Locator;
  private configBtn: Locator;
  private dwnldBtn: Locator;


  constructor(page: Page) {
    this.page = page;
    this.empId = page.locator("//input[@class='oxd-input oxd-input--active']");
    this.saveBtn = page.locator("//button[text()=' Save ']");
    this.firstName = page.locator("//input[@name='firstName']");
    this.lastName = page.locator("//input[@name='lastName']")
    this.addImg = page.locator("//input[@class='oxd-file-input']");
    this.addEmpTab= page.locator("//a[text()='Add Employee']");
    this.trmintnChkBtn = page.locator("//i[@class='oxd-icon bi-check oxd-checkbox-input-icon']");
    this.terminationTab= page.locator("//a[text()='Termination Reasons']");
    this.dwnldBtn = page.locator("//a[text()='Download']");
    this.dataImp = page.locator("//a[text()='Data Import']");
    this.configBtn = page.locator("//span[text()='Configuration ']");
    this.PIMLink = page.locator('//span[text()="PIM"]');
  


  }


  /**
 * Downloads a sample CSV file from the PIM > Configuration > Data Import section.
 *
 * Actions performed:
 * - Navigates through PIM > Configuration > Data Import.
 * - Initiates the file download by clicking the "Download" button.
 * - Waits for the download event and retrieves the suggested filename.
 * - Saves the downloaded file to the designated download directory.
 * - Returns the downloaded file's name for verification.
 *
 * @returns {Promise<string>} The name of the downloaded file.
 */


  async downldCsv() {
    await this.PIMLink.click();
    await this.configBtn.click();
    await this.dataImp.click();
    ensureDownloadFolder();
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.dwnldBtn.click()
    ]);
    const filename = download.suggestedFilename();
    const filePath = path.join(downloadDir, filename);
    await download.saveAs(filePath);
    await this.page.waitForTimeout(3000);
    return filename;

  }




  /**
 * Selects multiple termination reason checkboxes and retrieves the displayed count message.
 *
 * Actions performed:
 * - Navigates to PIM > Configuration > Termination Reasons.
 * - Clicks on the first three termination reason checkboxes.
 * - Extracts the selection count text shown on the page.
 *
 * @returns {Promise<string>} The displayed message showing how many records are selected.
 */

  async countTermination(){
    await this.PIMLink.click();
    await this.configBtn.click();
    await this.terminationTab.click();
    for(let i=1;i<4;i++){
      await this.trmintnChkBtn.nth(i).click();
    }
    return this.page.locator("//span[@class='oxd-text oxd-text--span']").innerText();

  }






  /**
 * Uploads an employee image and adds a new employee record.
 *
 * Actions performed:
 * - Navigates to PIM > Add Employee.
 * - Uploads a profile image.
 * - Fills in First Name, Last Name, and Employee ID fields.
 * - Submits the form by clicking Save.
 * - Waits for the profile page to load and extracts the displayed employee name.
 *
 * @param {string} firstName - The first name to use for the new employee.
 * @returns {Promise<string[]>} An array containing the full name displayed on the profile page.
 */

  async addPIMImage(firstName: string){
    await this.PIMLink.click();
    await this.addEmpTab.click();
    await this.addImg.setInputFiles(filePath);
    await this.page.waitForTimeout(1000);
    await this.firstName.fill(firstName)
    await this.lastName.fill("lastname");
    await this.empId.nth(1).fill(firstName);
    await this.saveBtn.click();
    await this.page.waitForTimeout(8000);
  
    return await  this.page.locator("div.orangehrm-edit-employee-name").allInnerTexts();

  }
}


//--------------------------------------------
function ensureDownloadFolder() {
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync('downloadDir')

  }
}