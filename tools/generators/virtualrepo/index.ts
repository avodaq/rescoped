import { Tree, logger, updateJson, readJson } from '@nrwl/devkit';
import { exec } from 'node:child_process';
import * as util from 'util';
import { existsSync, mkdirSync, rmdirSync } from 'node:fs';
import * as prompts from 'prompts';
import { readFile, writeFile } from 'node:fs/promises';

const execAsync = util.promisify(exec);

export interface Virtualrepo {
  namespace: string;
  base: string;
  repo: string;
  packages: Packages;
  rootPath: string;
  styles: Styles;
}

export interface Packages {
  [key: string]: string;
}

export interface Styles {
  [key: string]: string;
}

export default async function (tree: Tree, schema: any) {
  const packageJson = readJson(tree, 'package.json');

  const virtualRepo: Virtualrepo = packageJson?.virtualrepo;

  await cloneRepo(tree, virtualRepo);
  await updatePackageJson(tree, virtualRepo);
}

async function cloneRepo(tree: Tree, virtualRepo: Virtualrepo) {
  logger.info(`Cloning ${virtualRepo.repo}`);
  process.chdir('../');
  try {
    await execAsync(`git clone ${virtualRepo.repo}`);
  } catch (error) {
    return;
  }
}

async function updatePackageJson(tree: Tree, virtualRepo: Virtualrepo) {
  if (tree.isFile('nx.json')) {
    if (virtualRepo) {
      const pwd = process.cwd();
      let prevDir = pwd.split('/');
      prevDir.splice(-1);
      let prevRoot = prevDir.join('/');

      const path = `${pwd}/libs/${virtualRepo.namespace}`;

      if (!existsSync(path)) {
        mkdirSync(path);
      } else {
        const prompt = await prompts.prompt({
          type: 'confirm',
          name: 'confirmed',
          message: 'The symlink already exists. Do you want to overwrite it?',
        });

        if (!prompt.confirmed) {
          return;
        } else {
          logger.log('Overwriting symlink');
          rmdirSync(path, { recursive: true });
          mkdirSync(path);
        }
      }
      for (const key in virtualRepo.packages) {
        const { stdout, stderr } = await execAsync(
          `ln -s ${prevRoot}/${virtualRepo.rootPath}/${virtualRepo.packages[key]} ${pwd}/libs/${
            virtualRepo.namespace
          }/${virtualRepo.packages[key].split('/')[1]}`,
        );

        logger.info(`symlink created for ${virtualRepo.packages[key]}`);
        updateJson(tree, 'tsconfig.base.json', json => {
          const c = json.compilerOptions?.paths;
          delete c[`@${virtualRepo.namespace}/${key}`];

          c[`@${virtualRepo.namespace}/${key}/*`] = [`libs/${virtualRepo.namespace}/${key}/*`];
          return json;
        });
      }

      await syncStyles(tree, pwd, prevRoot, virtualRepo);

      await appendToFile(`${pwd}/.gitignore`, `libs/${virtualRepo.namespace}/`);
    }
  } else {
    logger.log('No nx.js  on file found. Check if you are in a nx workspace');
  }
}

async function syncStyles(tree: Tree, pwd: string, prevRoot: string, virtualRepo: Virtualrepo) {
  for (const style in virtualRepo.styles) {
    const { stdout, stderr } = await execAsync(
      `ln -s ${prevRoot}/${virtualRepo.rootPath}/${virtualRepo.styles[style]} ${pwd}/libs/${virtualRepo.namespace}/${style}`,
    );

    updateJson(tree, 'package.json', json => {
      const c = json.dependencies;
      delete c[`@${virtualRepo.namespace}/${style}`];
      c[`@${virtualRepo.namespace}/${style}-style`] = `file:libs/${virtualRepo.namespace}/${style}`;
      return json;
    });
  }
}

export function readFiles(fileName: string): Promise<string> {
  return readFile(fileName, 'utf-8');
}

export function writeFiles(fileName: string, content: string, options?: any): Promise<void> {
  return writeFile(fileName, content, options);
}

export function appendToFile(filePath: string, text: string, options?: any) {
  return readFiles(filePath).then((content: string) => {
    if (!content.includes(text)) {
      logger.info(`adding ${text} to .gitignore`);
      writeFiles(filePath, content + text, options);
    }
  });
}
