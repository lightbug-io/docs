const fs = require('node:fs');
const path = require('node:path');
const yaml = require('yaml');

const protocolYamlPath = path.resolve(__dirname, '../public/files/protocol-v3.yaml');
const expandedProtocolFilename = 'protocol-v3-expanded.yaml';

// Typed maps retain integer keys required by the SDK generators. Plain JS
// objects lose that distinction and would export numeric keys as strings.
// No defaults or message-version inheritance are applied here.
function expandProtocolYaml(source) {
  const document = yaml.parseDocument(source, { merge: true, customTags: ['timestamp'] });
  if (document.errors.length) throw document.errors[0];
  const protocol = document.toJS({ mapAsMap: true });
  if (!(protocol instanceof Map)) {
    throw new Error('The protocol YAML must contain a mapping');
  }
  protocol.delete('templates');
  return yaml.stringify(protocol, {
    aliasDuplicateObjects: false,
    lineWidth: 0,
    customTags: ['timestamp'],
    // Keep date-like and other ambiguous strings quoted for js-yaml and Go.
    compat: 'yaml-1.1',
  });
}

function readExpandedProtocol(sourcePath = protocolYamlPath) {
  return expandProtocolYaml(fs.readFileSync(sourcePath, 'utf8'));
}

function writeExpandedProtocol(outDir, sourcePath = protocolYamlPath) {
  const directory = path.join(outDir, 'files');
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, expandedProtocolFilename), readExpandedProtocol(sourcePath));
}

if (require.main === module) process.stdout.write(readExpandedProtocol());

module.exports = { expandProtocolYaml, readExpandedProtocol, writeExpandedProtocol, expandedProtocolFilename };
