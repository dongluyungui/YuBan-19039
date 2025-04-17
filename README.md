# YuBan-19039 项目文档

## 一、项目概述
YuBan-19039 项目是一个综合性的项目，整合了多种功能，如哔哩哔哩动态抓取、网页内容分页展示、标签检索等。同时，借助 GitHub Actions 工作流，实现了 Jekyll 网站的自动化构建与部署。

## 二、项目结构
```
YuBan-19039/
├── BakeDates/
│   ├── index.html
│   ├── index1.html
│   └── comment.html
├── Tools/
│   ├── bilibili-dynamic-fetcher/
│   │   ├── fetchDynamics.js
│   │   ├── package.json
│   │   └── package-lock.json
│   └── galleryRecords.html
├── .github/
│   └── workflows/
│       ├── jekyll-gh-pages.yml
│       └── jekyll-gh-pages one .yml
├── css/
│   └── pages.css
├── js/
│   ├── pages.js
│   ├── tagsearch.js
│   └── time.js
├── index.html
├── time.html
├── About.html
└── .gitignore
```

## 三、.gitignore 文件说明
`.gitignore` 文件由 Microsoft(R) Visual Studio 自动生成，用于指定 Git 版本控制系统应忽略的文件和目录，避免不必要的文件被纳入版本管理。其内容如下：
```
################################################################################
# 此 .gitignore 文件已由 Microsoft(R) Visual Studio 自动创建。
################################################################################

/.vs/YuBanWeb/v17
/.vs
/test.html
```
- `/.vs/YuBanWeb/v17` 和 `/.vs`：这两个条目表示忽略 Visual Studio 的配置和缓存文件目录，这些文件通常是项目特定的，无需进行版本控制。
- `/test.html`：表示忽略 `test.html` 文件，可能是测试用的临时文件，不需要纳入版本管理。

## 四、功能模块

### 1. 分页功能
分页功能用于对网页上的特定元素（如动态、文章、留言等）进行分页展示，提升用户浏览体验。
- **文件位置**：`js/pages.js`
- **主要函数**：
  - `initPagination()`：初始化分页功能，包括计算总页数、生成页码按钮等。
  - `generatePageButtons()`：生成页码按钮，包含第一页、上一页、页码、下一页和最后一页按钮。
  - `changePage(pageNumber)`：切换到指定页码，并更新页面显示，同时滚动到当前页的第一条内容。
  - `jumpToPage()`：允许用户输入页码并跳转到指定页面，若输入无效会给出提示。


### 2. 标签检索功能
提供根据标签筛选内容的功能，方便用户快速找到感兴趣的内容。
- **文件位置**：`js/tagsearch.js`
- **主要函数**：
  - `getTagElements()`：根据不同页面获取标签元素。
  - `initTagList()`：初始化标签列表，将所有标签添加到页面上，并为每个标签添加点击事件。
  - `filterByTag(tag)`：根据指定标签进行内容筛选。


## 五、运行步骤

### 1. 克隆项目
```bash
git clone https://github.com/your-repo/YuBan-19039.git
cd YuBan-19039
```

### 2. 运行项目
在浏览器中打开 `index.html` 文件，即可查看项目页面。

### 3. 自动部署
将代码推送到 `main` 分支，GitHub Actions 会自动触发构建和部署，部署完成后可在 GitHub Pages 上查看网站。

## 六、注意事项
- 仓库内所有的媒体文件都归原作者所有，仓库仅收集以便查找，如有侵犯著作权，请联系删除。

## 七、贡献指南
~~如果你想为项目做出贡献，请遵循以下步骤：~~
~~1. Fork 项目到你的 GitHub 仓库。~~
~~2. 创建新的分支进行开发。~~
~~3. 提交代码并创建 Pull Request。~~

## 八、许可证
本项目采用 [MIT 许可证](https://opensource.org/licenses/MIT)。