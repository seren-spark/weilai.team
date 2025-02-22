# 未来软件工作室官网

## 编码规范

### 命名规范

- prop 命名使用 `kebab-case` 形式，如 `user-name`。
- Vue 组件 命名使用 `PascalCase` 形式，如 `UserProfile`。
- 文件夹名称 采用 `kebab-case` 形式，如 `user-profile`。
- 变量命名 使用 `camelCase` 形式，如 `userName`。
- 常量命名 使用全大写和下划线连接，如 `API_BASE_URL`。
- 函数命名 使用 `camelCase` 形式，如 `fetchUserData()`。
- 类名命名 使用 `PascalCase`，如 `UserCard`。
- 接口命名 使用 `I` 前缀 + `PascalCase`，如 `IUser`。

### 分支管理

- `main` 为稳定主分支，所有经过测试并准备发布的功能和修复都应合并到 `main` 分支，向 `main` 提交代码会自动触发部署流程。
- `dev` 为开发分支，用于集成新功能及修复，开发过程中应合并功能分支到 `dev` 分支进行集成测试。

- 功能分支命名应遵循 `类型/功能` 格式，常见类型包括：

  - `feat/`：新功能开发（如 `feat/user-management`）
  - `fix/`：bug 修复（如 `fix/login-bug`）
  - `refactor/`：代码重构（如 `refactor/auth-service`）
  - `chore/`：项目构建或工具变动（如 `chore/update-dependencies`）
  - `docs/`：文档修改（如 `docs/update-readme`）

- 分支合并规范：

  - 开发完成后，功能分支应先合并至 `dev` 进行测试，确保无误后再由团队负责人合并到 `main`。
  - 合并前请确保分支已通过自动化测试。

## 提交规范

- 每次提交应保持清晰、简洁，并遵循 Git Commit Message Conventions。
- 提交信息格式：`<type>(<scope>): <subject>`

  - `type` 类型（必填）：描述提交的类别

    - `feat`：新功能（如 `feat: add user login functionality`）
    - `fix`：修复 bug（如 `fix: correct login timeout issue`）
    - `refactor`：重构代码（不影响功能的改动）
    - `docs`：修改文档
    - `style`：格式（代码样式修改，不影响代码逻辑）
    - `test`：增加测试
    - `chore`：构建过程或辅助工具的变动
    - `scope` 影响范围（可选）：标识变动涉及的模块或功能（如 `login`, `profile`）
    - `subject` 提交说明（必填）：简洁说明本次变动，建议 50 字符以内
