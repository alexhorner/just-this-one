const fs = require('fs');

if (fs.existsSync("manifest.firefox.json")) {
    fs.renameSync("manifest.json", "manifest.chrome.json");
    fs.renameSync("manifest.firefox.json", "manifest.json");

    console.log("Switched to Firefox manifest");
} else if (fs.existsSync("manifest.chrome.json")) {
    fs.renameSync("manifest.json", "manifest.firefox.json");
    fs.renameSync("manifest.chrome.json", "manifest.json");

    console.log("Switched to Chrome manifest");
} else {
    console.log("Unknown manifest state. Ensure a manifest.json and either a manifest.chrome.json or a manifest.firefox.json exists");
}