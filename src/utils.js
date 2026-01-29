import { execa } from 'execa';

export async function isCodeCmdAvailable() {
  try {
    const { code } = await execa('code', ['--version']);
    return code === 0; // command exists and is available
  } catch (err) {
    return false; // command not found or failed
  }
}
