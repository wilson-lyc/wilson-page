# GitHub Actions 自动部署

推送或合并提交到 `main` 后，工作流自动执行 `npm ci`、`npm run build`，再通过 SSH + rsync 将 `dist/` 内的内容上传到网站目录。也可以在 Actions → Deploy → Run workflow 中选择 `main` 手动运行。同一时间只执行一次部署，正在执行的部署不会被新提交中断；等待中的任务可能被更新的提交替代。

## GitHub 配置

进入仓库 **Settings → Secrets and variables → Actions → New repository secret**，配置：

| Secret | 内容示例 / 说明 |
| --- | --- |
| `DEPLOY_SSH_URL` | `ssh://deploy@example.com:22`，一个值包含 SSH 用户名、服务器地址和端口。地址支持域名或 IPv4，不是网站的 HTTPS 地址。 |
| `DEPLOY_SSH_PRIVATE_KEY` | 完整的 SSH 私钥，包含 BEGIN / END 行和换行。使用专门用于部署的、无口令的私钥，将对应公钥放入服务器部署用户的 `~/.ssh/authorized_keys`。不要把私钥提交到代码库。 |
| `DEPLOY_TARGET_DIR` | 网站根目录的绝对路径，例如 `/opt/1panel/www/sites/example.com/index`。上传后该目录直接包含 `index.html`，不会多一层 `dist/`。路径仅支持英文字母、数字、`/`、`_`、`-`、`.`，不支持空格、点路径段和根目录 `/`。 |
| `DEPLOY_SSH_KNOWN_HOSTS` | **额外必需项**：服务器 SSH 主机公钥记录，用来校验服务器身份，防止冒充服务器。它与登录私钥用途不同。获取方式见下文。 |

除以上 4 项外不需要其他配置。不要将真实密钥发送到聊天中，直接填入 GitHub Secrets 即可。

## 4 个 Secrets 的完整示例

假设 SSH 用户为 `deploy`，服务器为 `203.0.113.10`，SSH 端口为 `2222`，网站根目录为 `/opt/1panel/www/sites/example.com/index`。在 GitHub 中逐项填写下列 Name 和 Secret；不要把 `NAME=` 或外层引号一起填入。

这些配置必须创建在 **Secrets** 中，而不是同页面的 Variables 中，工作流通过 `secrets.*` 读取。

### 1. `DEPLOY_SSH_URL`

```text
ssh://deploy@203.0.113.10:2222
```

将用户名、服务器 IP 或域名、端口替换为实际 SSH 登录信息；端口即使是默认的 `22` 也需要填写。

### 2. `DEPLOY_SSH_PRIVATE_KEY`

```text
-----BEGIN OPENSSH PRIVATE KEY-----
<这里粘贴部署私钥文件的全部正文，保留原始换行>
-----END OPENSSH PRIVATE KEY-----
```

示例仅表示格式，尖括号内容不能直接使用。填写本机私钥文件（例如 `~/.ssh/github_deploy`）的完整内容，不要填写 `.pub` 公钥、文件路径或指纹。私钥必须无口令；其对应 `.pub` 内容应配置到服务器部署用户的 `~/.ssh/authorized_keys`。

### 3. `DEPLOY_TARGET_DIR`

```text
/opt/1panel/www/sites/example.com/index
```

填写服务器上实际的网站根目录，不是本地目录，也不需要在末尾加 `dist`。部署用户须拥有该目录的写权限。

### 4. `DEPLOY_SSH_KNOWN_HOSTS`

```text
[203.0.113.10]:2222 ssh-ed25519 <服务器实际的Base64主机公钥>
```

示例仅表示格式，必须替换为核对过的真实记录，不能直接使用占位内容。地址和端口应与 `DEPLOY_SSH_URL` 一致；默认端口 `22` 的记录通常以 `203.0.113.10` 开头。可以包含多行已核对的主机公钥，保留工具输出的原始格式。

以上示例使用文档专用 IP，实际配置时替换成自己的服务器地址。对应的扫描命令是 `ssh-keyscan -p 2222 203.0.113.10`；核对方式见下一节。

## 核对服务器身份

在可信电脑上获取候选主机公钥（替换地址与端口）：

```bash
ssh-keyscan -p 22 example.com > deploy_known_hosts
ssh-keygen -lf deploy_known_hosts
```

`ssh-keyscan` 本身不能证明服务器身份。通过服务器控制台执行以下命令，与扫描结果核对指纹（至少保留一条已核对的主机公钥记录）：

```bash
for key in /etc/ssh/ssh_host_*_key.pub; do ssh-keygen -lf "$key"; done
```

确认一致后，将 `deploy_known_hosts` 中已核对的公钥记录填入 `DEPLOY_SSH_KNOWN_HOSTS`。非默认端口的记录通常以 `[example.com]:2222` 开头，保持原样。服务器更换主机密钥时，需要重新核对并更新此 Secret。

## 服务器要求与更新行为

- Linux 服务器已安装 `rsync`，SSH 服务可从 GitHub 托管 runner 访问。
- 部署用户可以创建和写入目标目录，网站服务可以读取上传文件。脚本不使用 `sudo`，服务器无需安装 Node.js。
- 网站根目录应与 `DEPLOY_TARGET_DIR` 一致，HTTPS 和域名在服务器侧配置。
- 先上传资源文件，成功后再更新 `index.html`；传输失败时 Actions 会报错。不要手动并行部署。
- 保留服务器已有文件和旧版资源，不执行删除或清空目录，避免误删站点配置，也让已打开的页面仍可访问旧资源。旧文件可在确认不再使用后手动清理。
- 首次上线前可备份网站目录；此流程不提供自动备份、自动回滚或上线健康检查。资源成功上传但入口尚未更新时中断，旧入口仍然保留。

工作流：[deploy.yml](./.github/workflows/deploy.yml)；部署脚本：[deploy.sh](./scripts/deploy.sh)。

---

# 1Panel 手动部署

1. **本地打包**：在项目根目录执行 `npm run build`，生成 `dist/`。首次打包或依赖更新后，先执行 `npm ci`。
2. **创建网站**：在 1Panel「网站」中创建「静态网站」，绑定自己的域名；已有网站则直接使用。
3. **配置域名**：将域名的 A 记录指向服务器公网 IP，确保安全组和防火墙放行 `80`、`443` 端口。
4. **打开网站目录**：在 1Panel 中进入该网站的根目录。更新已有网站前，先将旧文件备份到网站目录之外。
5. **上传文件**：将 `dist/` **里面的全部内容**压缩成 ZIP，上传到网站根目录并解压。确保 `index.html` 直接位于根目录，不能多套一层 `dist/`；解压后删除 ZIP。更新时先上传资源文件，最后覆盖 `index.html`，不要先清空旧目录。
6. **检查页面**：访问 `http://你的域名/`，检查页面、图片和音乐。默认首页设为 `index.html`；本项目使用 Hash 路由，无需配置伪静态或反向代理。
7. **开启 HTTPS**：在网站「HTTPS」设置中申请或选择证书，启用后确认 HTTPS 可访问，再开启 HTTP 跳转 HTTPS。
8. **后续更新**：重新打包，重复备份和上传步骤，再强制刷新浏览器；使用 CDN 时同步刷新缓存。异常时恢复备份。

只上传构建产物，不上传源码、`node_modules/`、`.git/` 或 `docs/`。服务器无需安装 Node.js。以上按域名根路径（如 `https://example.com/`）部署。
