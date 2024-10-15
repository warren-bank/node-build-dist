#!/usr/bin/env node

const child_process = require('child_process')
const path = require('path')

let command, args, options

args = process.argv.slice(2)

options = {
  encoding: 'utf8',
  stdio: 'inherit'
}

if (process.platform === 'win32') {
  command = path.resolve(__dirname, 'build-dist.cmd')
  options = {
    ...options,
    shell: 'cmd.exe',
    windowsVerbatimArguments: true,
    windowsHide: false
  }
}
else {
  command = path.resolve(__dirname, 'build-dist.sh')
  options = {
    ...options,
    shell: 'bash'
  }
}

child_process.spawnSync(command, args, options)
