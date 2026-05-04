import { compressImage } from '../utils/image-compress.js';
import { createFrontmatter } from '../../lib/frontmatter.js';

export function WritePage(params, container) {
  container.innerHTML = `
    <div class="write-page">
      <h1>书写人生</h1>
      <div class="editor-toolbar">
        <select id="content-type">
          <option value="biography">传记章节</option>
          <option value="experience">经验教训</option>
          <option value="wisdom">人生建议</option>
        </select>
        <input type="text" id="doc-title" placeholder="标题（如：童年回忆）" />
        <select id="doc-language">
          <option value="zh">中文</option>
          <option value="en">English</option>
        </select>
      </div>
      <textarea id="editor" placeholder="开始书写..." rows="20"></textarea>
      <div class="editor-footer">
        <label class="btn btn-secondary">
          添加图片
          <input type="file" accept="image/*" id="image-input" hidden />
        </label>
        <span id="image-status"></span>
        <button id="publish-btn" class="btn btn-primary">发布到 Arweave</button>
      </div>
      <div id="preview-area" class="preview hidden"></div>
    </div>
  `;

  const editor = container.querySelector('#editor');
  const imageInput = container.querySelector('#image-input');
  const publishBtn = container.querySelector('#publish-btn');

  imageInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const blob = await compressImage(file);
      const status = container.querySelector('#image-status');
      status.textContent = `已压缩: ${(blob.size / 1024).toFixed(1)}KB`;
    } catch (err) {
      alert(err.message);
    }
  });

  publishBtn.addEventListener('click', async () => {
    const title = container.querySelector('#doc-title').value;
    const content = editor.value;
    const type = container.querySelector('#content-type').value;
    const language = container.querySelector('#doc-language').value;

    if (!content.trim()) {
      alert('请先书写内容');
      return;
    }

    if (!window.arweaveWallet) {
      alert('请先连接 ArConnect 钱包');
      return;
    }

    try {
      const address = await window.arweaveWallet.getActiveAddress();
      const fm = createFrontmatter({ author: `did:ar:${address}`, language });
      const fullContent = fm + content;

      const tx = await window.arweaveWallet.createTransaction({
        data: fullContent,
        tags: [
          { name: 'Content-Type', value: 'text/markdown' },
          { name: 'App-Name', value: 'EternalLife' },
          { name: 'File-Type', value: type },
          { name: 'Title', value: title },
          { name: 'Language', value: language },
        ],
      });

      await window.arweaveWallet.dispatch(tx);
      alert(`发布成功！交易 ID: ${tx.id}`);
      editor.value = '';
    } catch (err) {
      alert(`发布失败: ${err.message}`);
    }
  });
}
