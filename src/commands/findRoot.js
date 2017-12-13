import { FileSystem } from '../models'
import path from 'path'

/**
 * Find the root git directory
 * @param {GitRepo} repo - A {@link Git} object matching `{fs}`
 * @param {Object} args - Arguments object
 * @param {string} args.filepath - The file directory to start searching in.
 * @returns {Promise<string>} - a directory name
 * @throws {Error} - Error('Unable to find git root')
 *
 * Starting at `filepath`, will walk upwards until it finds a directory that contains a directory called '.git'.
 *
 * @example
 * let repo = new Git({fs, dir: '.'})
 * let gitroot = await findRoot(repo, {
 *   filepath: '/path/to/some/gitrepo/path/to/some/file.txt'
 * })
 * // gitroot = '/path/to/some/gitrepo'
 */
export async function findRoot ({ fs: _fs }, { filepath }) {
  const fs = new FileSystem(_fs)
  return _findRoot(fs, filepath)
}

async function _findRoot (fs, filepath) {
  if (await fs.exists(path.join(filepath, '.git'))) {
    return filepath
  } else {
    let parent = path.dirname(filepath)
    if (parent === filepath) throw new Error('Unable to find git root')
    return _findRoot(fs, parent)
  }
}