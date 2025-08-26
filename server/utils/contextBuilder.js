const fs = require('fs');
const path = require('path');

function safeRead(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (_) {
    return '';
  }
}

function extractDeps(pkgJsonStr) {
  try {
    const pkg = JSON.parse(pkgJsonStr);
    const deps = Object.assign({}, pkg.dependencies || {}, pkg.devDependencies || {});
    return Object.entries(deps)
      .map(([k, v]) => `- ${k}: ${v}`)
      .sort()
      .join('\n');
  } catch {
    return '';
  }
}

function listApiRoutes(serverDir) {
  const routesDir = path.join(serverDir, 'routes');
  const files = fs.existsSync(routesDir) ? fs.readdirSync(routesDir) : [];
  return files
    .filter(f => f.endsWith('.js'))
    .map(f => {
      const name = f.replace(/\.js$/, '');
      return `/api/v1/${name}`;
    })
    .join('\n');
}

function listUiSections(clientDir) {
  const sectionsDir = path.join(clientDir, 'src', 'components', 'sections');
  if (!fs.existsSync(sectionsDir)) return '';
  const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.jsx'));
  return files
    .map(f => `- ${f.replace(/\.jsx$/, '')}`)
    .join('\n');
}

async function getPortfolioContext() {
  const root = path.resolve(__dirname, '..', '..');
  const clientDir = path.join(root, 'client');
  const serverDir = path.join(root, 'server');

  const clientPkg = safeRead(path.join(clientDir, 'package.json'));
  const serverPkg = safeRead(path.join(serverDir, 'package.json'));

  const clientDeps = extractDeps(clientPkg);
  const serverDeps = extractDeps(serverPkg);

  return {
    client: { name: 'client', deps: clientDeps },
    server: { name: 'server', deps: serverDeps },
    apiRoutes: listApiRoutes(serverDir),
    uiSections: listUiSections(clientDir)
  };
}

module.exports = { getPortfolioContext };
