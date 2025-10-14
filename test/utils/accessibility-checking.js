import * as wcagChecker from '../../dist/wcagchecker.js'
import fs from 'fs'
import path from 'path'
import logger from '@wdio/logger'

const log = logger('landGrantsAccessibilityTests')
const reportDirectory = path.join('./reports')
let allViolations = [] // Store violations for report generation

export async function initialiseAccessibilityChecking() {
  if (!fs.existsSync(reportDirectory)) {
    fs.mkdirSync(reportDirectory)
  }

  await wcagChecker.init(browser)
}

export async function analyseAccessibility(suffix) {
  try {
    await wcagChecker.analyse(browser, suffix)
  } catch (error) {
    log.warn(`wcagChecker failed for ${suffix || 'page'}, using fallback`)

    try {
      const result = await browser.executeAsync((done) => {
        if (typeof window.axe !== 'undefined') {
          window.axe
            .run()
            .then((results) => {
              done(results.violations)
            })
            .catch(() => done([]))
        } else {
          done([])
        }
      })

      if (result && result.length > 0) {
        allViolations.push({
          page: suffix || 'unknown',
          url: await browser.getUrl(),
          violations: result
        })
        log.info(`Found ${result.length} violations for ${suffix}`)
      }
    } catch (fallbackError) {
      log.error(`Fallback failed: ${fallbackError.message}`)
    }
  }
}

export function generateAccessibilityReports(filePrefix) {
  const categoryReport = wcagChecker.getHtmlReportByCategory()
  const guidelineReport = wcagChecker.getHtmlReportByGuideLine()

  if (categoryReport && categoryReport.length > 0) {
    fs.writeFileSync(
      path.join(reportDirectory, `${filePrefix}-accessibility-category.html`),
      categoryReport
    )
  }

  if (guidelineReport && guidelineReport.length > 0) {
    fs.writeFileSync(
      path.join(reportDirectory, `${filePrefix}-accessibility-guideline.html`),
      guidelineReport
    )
  }

  if (allViolations.length > 0) {
    const html = generateFallbackReport(filePrefix, allViolations)
    fs.writeFileSync(
      path.join(reportDirectory, `${filePrefix}-accessibility-fallback.html`),
      html
    )
  }

  allViolations = []
}

function generateFallbackReport(filePrefix, violations) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Accessibility Report - ${filePrefix}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
        .violation { border: 1px solid #d32f2f; margin: 20px 0; padding: 15px; background: #ffebee; }
        .page-title { color: #1976d2; font-size: 1.5em; margin-top: 30px; }
        .impact-critical { color: #d32f2f; font-weight: bold; }
        .impact-serious { color: #f57c00; font-weight: bold; }
        .impact-moderate { color: #fbc02d; font-weight: bold; }
        .impact-minor { color: #388e3c; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Accessibility Report: ${filePrefix}</h1>
    <p>Generated: ${new Date().toLocaleString()}</p>
    
    ${violations
      .map(
        (pageData) => `
        <div class="page-section">
            <h2 class="page-title">${pageData.page}</h2>
            <p><strong>URL:</strong> ${pageData.url}</p>
            <p><strong>Violations:</strong> ${pageData.violations.length}</p>
            
            ${pageData.violations
              .map(
                (v) => `
                <div class="violation">
                    <h3>${v.id}: ${v.help}</h3>
                    <p class="impact-${v.impact}">Impact: ${v.impact}</p>
                    <p>${v.description}</p>
                    <p><strong>Affected elements:</strong> ${v.nodes.length}</p>
                    <ul>
                        ${v.nodes
                          .slice(0, 3)
                          .map(
                            (node) => `
                            <li><code>${node.html}</code></li>
                        `
                          )
                          .join('')}
                    </ul>
                    <a href="${v.helpUrl}" target="_blank">More info</a>
                </div>
            `
              )
              .join('')}
        </div>
    `
      )
      .join('')}
</body>
</html>
  `
}
export function generateAccessibilityReportIndex() {
  if (!fs.existsSync(reportDirectory)) {
    fs.mkdirSync(reportDirectory, { recursive: true })
    return
  }

  const filenames = fs
    .readdirSync(reportDirectory)
    .filter((f) => f.endsWith('.html') && f !== 'index.html')

  const html = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>APHA SDO Accessibility Testing Reports</title>
                <style>
                    body {
                        font-family: 'GDS Transport', arial, sans-serif;
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f8f8f8;
                    }
                    .header {
                        background: #1d70b8;
                        color: white;
                        padding: 20px;
                        border-radius: 8px;
                        margin-bottom: 30px;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 2rem;
                    }
                    .header p {
                        margin: 10px 0 0 0;
                        opacity: 0.9;
                    }
                    .reports-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                        gap: 20px;
                        margin-bottom: 30px;
                    }
                    .report-card {
                        background: white;
                        border: 1px solid #dee2e6;
                        border-radius: 8px;
                        padding: 20px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        transition: transform 0.2s;
                    }
                    .report-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                    }
                    .report-title {
                        font-size: 1.2rem;
                        font-weight: bold;
                        color: #1d70b8;
                        margin-bottom: 10px;
                        text-decoration: none;
                    }
                    .report-title:hover {
                        text-decoration: underline;
                    }
                    .report-type {
                        background: #f0f9ff;
                        color: #1d70b8;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 0.8rem;
                        font-weight: bold;
                        display: inline-block;
                        margin-bottom: 10px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding: 20px;
                        color: #666;
                        border-top: 1px solid #dee2e6;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>♿ Accessibility Testing Reports</h1>
                    <p>Generated on ${new Date().toLocaleString()}</p>
                    <p>Total Reports: ${filenames.length}</p>
                </div>

                ${
                  filenames.length === 0
                    ? '<div class="report-card"><p>No accessibility reports found. Run tests with the accessibility config to generate reports.</p></div>'
                    : `<div class="reports-grid">
                        ${filenames
                          .map((filename) => {
                            const isCategory = filename.includes('-category')
                            const isGuideline = filename.includes('-guideline')
                            const reportType = isCategory
                              ? 'By Category'
                              : isGuideline
                                ? 'By Guideline'
                                : 'General'
                            const displayName = filename
                              .replace('-accessibility-category.html', '')
                              .replace('-accessibility-guideline.html', '')
                              .replace('.html', '')
                              .replace(/-/g, ' ')
                              .replace(/\b\w/g, (l) => l.toUpperCase())

                            return `
                                <div class="report-card">
                                    <div class="report-type">${reportType}</div>
                                    <a href="${filename}" class="report-title">${displayName}</a>
                                    <p>Click to view detailed accessibility analysis</p>
                                </div>
                            `
                          })
                          .join('')}
                    </div>`
                }

                <div class="footer">
                    <p>Generated by WebDriverIO Accessibility Testing Suite</p>
                    <p>Reports are organized by test suite and analysis type</p>
                </div>
            </body>
        </html>
        `
  fs.writeFileSync(path.join(reportDirectory, 'index.html'), html, (err) => {
    if (err) throw err
  })

  // Reports will be copied to Allure directory after Allure report generation
}
