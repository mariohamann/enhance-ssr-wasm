import fs from 'fs';
import path from 'path';

function ensureAndCleanDirectory(basePath) {
  if (fs.existsSync(basePath)) {
    fs.rmSync(basePath, { recursive: true, force: true });
  }
  fs.mkdirSync(basePath, { recursive: true });
}

async function getVersion() {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageData.version;
}

function copyWasmFile(targetDir) {
  const sourcePath = path.resolve(process.cwd(), 'dist', 'enhance-ssr.wasm');
  const targetPath = path.join(targetDir, 'enhance-ssr.wasm');
  fs.copyFileSync(sourcePath, targetPath);
}

async function createPackages() {
  const version = await getVersion();
  const distBasePath = path.resolve(process.cwd(), 'dist');

  // NPM
  const npmPath = path.join(distBasePath, 'npm');
  ensureAndCleanDirectory(npmPath);
  const nodePackageData = `{
  "name": "@enhance/ssr-wasm",
  "version": "${version}",
  "description": "Enhanced SSR functionality",
  "type": "module"
}`;
  fs.writeFileSync(path.join(npmPath, 'package.json'), nodePackageData);
  copyWasmFile(npmPath);

  // Composer
  const composerPath = path.join(distBasePath, 'composer');
  ensureAndCleanDirectory(composerPath);
  const composerPackageData = `{
  "name": "enhance/enhance-ssr",
  "type": "library",
  "description": "Enhanced SSR functionality",
  "version": "${version}",
  "autoload": {
    "files": ["enhance-ssr.wasm"]
  }
}`;
  fs.writeFileSync(path.join(composerPath, 'composer.json'), composerPackageData);
  copyWasmFile(composerPath);

  console.log(`Packages created successfully for version ${version}.`);
}

createPackages().catch(console.error);
