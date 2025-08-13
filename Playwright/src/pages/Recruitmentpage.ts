import {Page, Locator} from "@playwright/test";
export default class Recruitment{
    readonly page : Page;
    private recruitment : Locator;
    private vacancy : Locator;
    private candidate : Locator;
    private firstName : Locator;
    private lastName : Locator;
    private emailInput : Locator;
    private saveButton : Locator;
    private deleteBtn : Locator;
    private deleteConfirmation: Locator ;
    private addBtn: Locator ;

    constructor(page : Page){
        this.page = page
        this.addBtn = page.locator("//button[text()=' Add ']");
        this.deleteConfirmation = page.locator("//button[text()=' Yes, Delete ']");

        this.deleteBtn = page.locator("//i[@class='oxd-icon bi-trash']");
        this.saveButton = page.locator("//button[text()=' Save ']");
        this.emailInput = page.locator("//input[@placeholder='Type here']");
        this.firstName = page.locator("//input[@name='firstName']");
        this.lastName = page.locator("//input[@name='lastName']")
        this.recruitment = page.locator("//span[text()='Recruitment']");
        this.vacancy = page.locator("//a[text()='Vacancies']");
        this.candidate = page.locator("//a[text()='Candidates']")


    }





    /**
 * Navigates to the Recruitment > Vacancy section and returns the current page URL.
 *
 * Steps performed:
 * - Clicks on the "Recruitment" main link.
 * - Waits for the page to load.
 * - Clicks on the "Vacancy" tab.
 * - Waits for the vacancy page to load.
 * - Returns the current page URL.
 *
 * @returns {Promise<string>} The URL of the recruitment vacancy page.
 */

    async recritmentLink(){
        this.recruitment.click();
        await this.page.waitForTimeout(2000);
        await this.vacancy.click();
        await this.page.waitForTimeout(1000);
        


        return await this.page.url();


    }

    async deleteCandidate(firstname: string,email : string){
        this.recruitment.click();
        await this.page.waitForTimeout(2000);
        await this.candidate.click();
        await this.addBtn.click();
        await this.page.waitForTimeout(2000);

        await this.firstName.fill(firstname);
        await this.lastName.fill("lastname");
        await this.emailInput.nth(0).fill(email);
        await this.saveButton.click();
        await this.page.waitForTimeout(7000);
        await this.candidate.click();
        await this.page.waitForTimeout(4000);
        await this.deleteBtn.nth(0).click();
        await this.page.waitForTimeout(1500);
        await this.deleteConfirmation.click();
        await this.page.waitForTimeout(6000);
        const nameList = await this.page.locator("//div[@role='row'][1]/div[3]/div").allInnerTexts();

        return nameList;
        


    }


}