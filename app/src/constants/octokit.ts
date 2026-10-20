// GitHub
import { Octokit } from '@octokit/core';

const accessToken = import.meta.env.VITE_GITHUB_API_ACCESS_TOKEN;
export const octokit = new Octokit({ auth: accessToken });
