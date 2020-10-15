#!/usr/bin/env node
const packageJson = require('./package.json');

const fs = require('fs');
const canhazdb = require('./');

const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));

async function main (options) {
  let tls;

  if (options.tlsCa || options.tlsCert || options.tlsKey) {
    tls = {
      key: fs.readFileSync(options.tlsKey),
      cert: fs.readFileSync(options.tlsCert),
      ca: [fs.readFileSync(options.tlsca)],
      requestCert: true
    };

    if (!tls.key || !tls.cert || !tls.ca) {
      console.log(chalk.red('You must specifiy either all [tls-key, tls-cert, tls-ca] or none of them'));
      return;
    }
  }

  const host = options.host;
  const port = options.port;
  const node = await canhazdb({ host, port, queryPort: options.queryPort, tls });

  console.log(`canhazdb listening on ${host}:${port}`);

  if (options.join) {
    const [host, port] = options.join.split(':');
    console.log(`  joining ${host}:${port}`);
    await node.join({ host, port });
  }
}

function showHelp () {
  console.log(`
The scalable, sharded database engine.
https://github.com/markwylde/canhazdb

The following commands and arguments are available when starting Bitabase
Arguments:
  --host          optional     The host to bind the internal and query server on (default: localhost)
  --port          optional     The port to bind the internal server on (default: 7060)
  --query-port    optional     The port to bind the https query server on (default: 8060)

  --tls-ca        optional     The certificate authority to use for the certs
  --tls-cert      optional     The public certificate for the internal and query servers
  --tls-key       optional     The private key for the internal and query servers

  --join          optional     Join another canhazdb node

  `.trim() + '\n');
}

console.log(`${chalk.green(chalk.bold(`📦 ${packageJson.name}`))} ${chalk.green(`- v${packageJson.version}`)}`);

if (argv.help) {
  showHelp();
  process.exit(1);
} else {
  main({
    host: argv.host || 'localhost',
    port: argv.host || 7060,
    queryPort: argv.host || 8060,

    tlsCa: argv['tls-ca'],
    tlsCert: argv['tls-cert'],
    tlsKey: argv['tls-key'],

    join: argv.join
  });
}