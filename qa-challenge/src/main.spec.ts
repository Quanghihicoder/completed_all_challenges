import { test, expect } from "@playwright/test";
import { extractTileCoordinate } from "./utils";

test.describe("Initial setup", () => {
  test("Page displays correct title", async ({ browser }) => {
    const page = await browser.newPage();

    await page.goto("https://caniuse.propelleraero.com/");

    await expect(page.locator("#root")).toBeVisible();
    await expect(page.getByText("Can I use Propeller?")).toBeVisible();

    const title = await page.title();
    expect(title).toBe("Can I use Propeller?");
  });

  test("Search for a location and display results", async ({
    browser,
  }) => {
    const page = await browser.newPage();

    await page.goto("https://caniuse.propelleraero.com/");

    const searchInput = page.getByRole("combobox");
    await searchInput.fill("Sydney");

    const dropDownResults = page.getByRole("listbox");

    await expect(dropDownResults).toBeVisible();
    expect(dropDownResults).toHaveText([
      "Sydney, New South Wales, Australia",
      "Sydney, Nova Scotia, Canada",
      "Sydney Olympic Park, New South Wales, Australia",
      "Sydney Waterfront District, Sydney, Nova Scotia, Canada",
      "Sydney River, Sydney, Nova Scotia, Canada",
    ].join(""));
  });

  test("Zoom Controls: Verify that zoom in and out buttons work", async ({ page }) => {
    await page.goto("https://caniuse.propelleraero.com/");

    // Init
    const tileImgInit = page.locator('img.leaflet-tile[src*="mc/"]');
    await tileImgInit.first().waitFor();
  
    const initialSrc = await tileImgInit.first().getAttribute("src");
    const [, , initialZ] = extractTileCoordinate(initialSrc!);
  
    // Click zoom in
    const zoomIn = page.getByRole("button", { name: "Zoom in" });
    await zoomIn.click();
    await page.waitForTimeout(1000); // give it time to load new tiles
  
    const tileImgIn = page.locator('img.leaflet-tile[src*="mc/"]');
    await tileImgIn.first().waitFor();

    const zoomedInSrc = await tileImgIn.first().getAttribute("src");
    const [, , zoomedInZ] = extractTileCoordinate(zoomedInSrc!);
  
    expect(Number(zoomedInZ)).toBeGreaterThan(Number(initialZ));
  
    // Click zoom out
    const zoomOut = page.getByRole("button", { name: "Zoom out" });
    await zoomOut.click();
    await page.waitForTimeout(1000);

    const tileImgOut = page.locator('img.leaflet-tile[src*="mc/"]');
    await tileImgOut.first().waitFor();
  
    const zoomedOutSrc = await tileImgOut.first().getAttribute("src");
    const [, , zoomedOutZ] = extractTileCoordinate(zoomedOutSrc!);
  
    expect(Number(zoomedOutZ)).toBeLessThan(Number(zoomedInZ));

    // 1 In, 1 Out = Init
    expect(Number(zoomedOutZ)).toBe(Number(initialZ));
  });
});
