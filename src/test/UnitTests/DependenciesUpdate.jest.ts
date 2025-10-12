/**
 * Unit tests to verify that updated dependencies work correctly
 */

// Test updated dependencies
test('Express 5.1.0 should be importable and functional', () => {
  const express = require('express');
  expect(express).toBeDefined();
  expect(typeof express).toBe('function');
  
  const app = express();
  expect(app).toBeDefined();
  expect(typeof app.get).toBe('function');
  expect(typeof app.post).toBe('function');
  expect(typeof app.use).toBe('function');
});

test('EJS 3.1.10 should be importable and functional', () => {
  const ejs = require('ejs');
  expect(ejs).toBeDefined();
  expect(typeof ejs.render).toBe('function');
  
  const template = '<p><%= message %></p>';
  const result = ejs.render(template, { message: 'Hello World' });
  expect(result).toBe('<p>Hello World</p>');
});

test('Markdown-it 14.1.0 should be importable and functional', () => {
  const MarkdownIt = require('markdown-it');
  expect(MarkdownIt).toBeDefined();
  
  const md = new MarkdownIt();
  expect(md).toBeDefined();
  expect(typeof md.render).toBe('function');
  
  const result = md.render('# Heading');
  expect(result).toContain('<h1>Heading</h1>');
});

test('Markdown-it-attrs 4.3.1 should be importable and functional', () => {
  const MarkdownIt = require('markdown-it');
  const markdownItAttrs = require('markdown-it-attrs');
  
  expect(markdownItAttrs).toBeDefined();
  expect(typeof markdownItAttrs).toBe('function');
  
  const md = new MarkdownIt().use(markdownItAttrs);
  expect(md).toBeDefined();
  
  const result = md.render('# Heading {#custom-id}');
  expect(result).toContain('id="custom-id"');
});

test('Prettier 3.6.2 should be importable', () => {
  // Prettier is an ES module, but we can verify it's installed correctly
  const fs = require('fs');
  const path = require('path');
  const prettierPath = path.join(__dirname, '../../../node_modules/prettier/package.json');
  expect(fs.existsSync(prettierPath)).toBe(true);
  const prettierPkg = JSON.parse(fs.readFileSync(prettierPath, 'utf-8'));
  expect(prettierPkg.version.startsWith('3.6')).toBe(true);
});

test('Morgan 1.10.1 should be importable and functional', () => {
  const morgan = require('morgan');
  expect(morgan).toBeDefined();
  expect(typeof morgan).toBe('function');
  
  const middleware = morgan('tiny');
  expect(middleware).toBeDefined();
  expect(typeof middleware).toBe('function');
});

test('Open 8.4.2 should be importable', () => {
  const open = require('open');
  expect(open).toBeDefined();
  expect(typeof open).toBe('function');
});

test('Supertest 7.1.4 should be importable', () => {
  const request = require('supertest');
  expect(request).toBeDefined();
  expect(typeof request).toBe('function');
  // Supertest is already tested in RevealServer.jest.ts
});

test('Esbuild 0.24.2 should be importable', () => {
  const esbuild = require('esbuild');
  expect(esbuild).toBeDefined();
  expect(typeof esbuild.build).toBe('function');
  expect(typeof esbuild.transform).toBe('function');
});

test('TypeScript 4.9.5 should be functional', () => {
  const ts = require('typescript');
  expect(ts).toBeDefined();
  expect(ts.version).toBeDefined();
  expect(typeof ts.transpileModule).toBe('function');
  
  // Test basic transpilation
  const result = ts.transpileModule('const x: number = 42;', {
    compilerOptions: { module: ts.ModuleKind.CommonJS }
  });
  expect(result.outputText).toBeDefined();
  expect(result.outputText).toContain('42');
});

test('Markdown-it plugins should work together', () => {
  const MarkdownIt = require('markdown-it');
  const markdownItAttrs = require('markdown-it-attrs');
  const markdownItDiv = require('markdown-it-div');
  const markdownItMark = require('markdown-it-mark');
  const markdownItSub = require('markdown-it-sub');
  const markdownItSup = require('markdown-it-sup');
  const markdownItIns = require('markdown-it-ins');
  const markdownItAbbr = require('markdown-it-abbr');
  
  const md = new MarkdownIt()
    .use(markdownItAttrs)
    .use(markdownItDiv)
    .use(markdownItMark)
    .use(markdownItSub)
    .use(markdownItSup)
    .use(markdownItIns)
    .use(markdownItAbbr);
  
  expect(md).toBeDefined();
  
  // Test various plugin features
  const result1 = md.render('==marked text==');
  expect(result1).toContain('<mark>marked text</mark>');
  
  const result2 = md.render('H~2~O');
  expect(result2).toContain('<sub>2</sub>');
  
  const result3 = md.render('x^2^');
  expect(result3).toContain('<sup>2</sup>');
  
  const result4 = md.render('++inserted++');
  expect(result4).toContain('<ins>inserted</ins>');
});

test('Core dependencies versions should match package.json', () => {
  const packageJson = require('../../../package.json');
  
  // Check that key updated dependencies are present
  expect(packageJson.dependencies['express']).toBe('^5.1.0');
  expect(packageJson.dependencies['markdown-it-attrs']).toBe('^4.3.1');
  expect(packageJson.dependencies['morgan']).toBe('^1.10.1');
  expect(packageJson.dependencies['open']).toBe('^8.4.2');
  expect(packageJson.dependencies['prettier']).toBe('^3.6.2');
  
  // Check devDependencies
  expect(packageJson.devDependencies['@types/jest']).toBe('^27.5.2');
  expect(packageJson.devDependencies['@types/node']).toBe('^22.18.10');
  expect(packageJson.devDependencies['@types/vscode']).toBe('^1.105.0');
  expect(packageJson.devDependencies['esbuild']).toBe('^0.24.2');
  expect(packageJson.devDependencies['eslint']).toBe('^8.57.1');
  expect(packageJson.devDependencies['supertest']).toBe('^7.1.4');
  expect(packageJson.devDependencies['ts-jest']).toBe('^27.1.5');
});
