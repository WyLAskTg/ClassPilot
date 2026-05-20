const path = require("path");

module.exports = async function afterPack(context) {
  if (context.electronPlatformName !== "win32") {
    return;
  }

  const { rcedit } = await import("rcedit");
  const productName = context.packager.appInfo.productFilename;
  const exePath = path.join(context.appOutDir, `${productName}.exe`);
  const iconPath = path.join(__dirname, "..", "build", "icon.ico");
  const version = context.packager.appInfo.version;

  await rcedit(exePath, {
    icon: iconPath,
    "file-version": version,
    "product-version": version,
    "requested-execution-level": "asInvoker",
    "version-string": {
      FileDescription: "ClassPilot",
      InternalName: "ClassPilot",
      OriginalFilename: "ClassPilot.exe",
      ProductName: "ClassPilot",
    },
  });
};
