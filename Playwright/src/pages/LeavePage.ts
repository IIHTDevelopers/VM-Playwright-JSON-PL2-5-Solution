import {Page, Locator} from '@playwright/test';



export default class Leave{

readonly page: Page;
private leave :Locator;
private configTab : Locator;
private holidays :Locator;
private saveButton: Locator;
private leaveAssignMsg: Locator;
private assignBtn: Locator;
private assignLeaveTab: Locator;


    constructor(page: Page){
        this.page = page;
        this.saveButton = page.locator("//button[text()=' Search ']");
        this.leave = page.locator("//span[text()='Leave']");
        this.configTab = page.locator("//span[text()='Configure ']");
        this.holidays = page.locator("//a[text()='Holidays']");
        this.leaveAssignMsg= page.locator("//span[text()='Required']");
    this.assignBtn= page.locator("//button[text()=' Assign ']");
    this.assignLeaveTab= page.locator("//a[text()='Assign Leave']");
    this.leave = page.locator("//ul[@class='oxd-main-menu']/li[3]");


    }


    /**
 * Navigates to the Holidays configuration section and retrieves the list of holiday entries.
 *
 * Steps performed:
 * - Clicks on the "Leave" menu.
 * - Navigates to the "Configure" -> "Holidays" tab.
 * - Clicks the Save/Search button to load holiday data.
 * - Returns the list of holiday names or dates as displayed in the second column.
 *
 * @returns {Promise<string[]>} A list of strings representing the holidays listed in the table.
 */

    async holiday(){
        await this.leave.click();
        await this.page.waitForTimeout(2000);
        await this.configTab.click();
        await this.holidays.click();
        await this.saveButton.click();
        await this.page.waitForTimeout(4000);
        return this.page.locator("//div[@role='row']/div[2]").allInnerTexts();

    }
   



    /**
 * Attempts to assign leave without filling required fields and returns the resulting error message.
 *
 * Steps performed:
 * - Clicks on the Leave menu.
 * - Opens the Assign Leave tab.
 * - Clicks the "Assign" button without entering any field values.
 * - Captures and returns the first validation error message shown.
 *
 * @returns {Promise<string>} The validation error message displayed (e.g., "Required").
 */

async verifyLeaveField(): Promise<string> {
  await this.leave.click();
  await this.assignLeaveTab.click();
  await this.assignBtn.click();

  return await this.leaveAssignMsg.nth(0).textContent() ?? "";
}


}