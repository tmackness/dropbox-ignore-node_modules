#!/usr/bin/env node
const { exec } = require("child_process");
const fs = require('fs');

(async () => {
  try {
    const cwd = process.cwd();
    const modulesPath = cwd + '/node_modules';

    // check if node_modules exists
    const nodeModulesExist = fs.existsSync(modulesPath);
    if (!nodeModulesExist) {
      throw new Error(`A node_modules directory does not exist in this location - ${cwd}`)
    }

    // shell command
    const platform = process.platform;
    const command = (
      platform === "win32"
        ? `powershell "Set-Content -Path '${modulesPath}' -Stream com.dropbox.ignored -Value 1"`
        : platform === "darwin"
          ? `xattr -w com.dropbox.ignored 1 ${modulesPath.replace(" ", "\\ ")}`
          : `attr -s com.dropbox.ignored -V 1 ${modulesPath}`
    );

    // execute shell command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      if (stderr) {
        throw stderr;
      }
      
      console.log("Dropbox is now ignoring node_modules.");
    });
    
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
})();
