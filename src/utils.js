import { execa } from 'execa';

export async function isCodeCmdAvailable() {
  try {
    await execa('code', ['--version']);
    return true; // command exists
  } catch (err) {
    return false; // command not found
  }
}
