        const htmlCode = document.getElementById('html-code');
        const cssCode = document.getElementById('css-code');
        const jsCode = document.getElementById('js-code');
        const runBtn = document.getElementById('run-btn');
        const output = document.getElementById('output');

        // Apply dark mode styles
        document.body.style.background = "#181818";
        document.body.style.color = "#e0e0e0";
        document.querySelector("header").style.background = "#111";
        document.querySelector("header").style.color = "#fff";
        document.querySelectorAll(".editor-panel").forEach(panel => {
            panel.style.background = "#222";
            panel.style.borderRadius = "4px";
            panel.style.padding = "1em";
        });
        document.querySelectorAll("textarea").forEach(area => {
            area.style.background = "#1e1e1e";
            area.style.color = "#e0e0e0";
            area.style.border = "1px solid #444";
        });
        runBtn.style.background = "#333";
        runBtn.style.color = "#fff";
        runBtn.style.border = "1px solid #444";
        runBtn.onmouseover = () => runBtn.style.background = "#444";
        runBtn.onmouseout = () => runBtn.style.background = "#333";
        output.style.background = "#1e1e1e";
        output.style.border = "1px solid #444";

        runBtn.addEventListener('click', () => {
            const html = htmlCode.value;
            const css = `<style>body{background:#181818;color:#e0e0e0;}${cssCode.value}</style>`;
            const js = `<script>${jsCode.value}<\/script>`;
            const srcDoc = `${html}\n${css}\n${js}`;
            output.srcdoc = srcDoc;
        });

        function updateOutput() {
    const html = htmlCode.value;
    const css = `<style>${cssCode.value}</style>`;
    const js = `<script>${jsCode.value}<\/script>`;
    output.srcdoc = html + css + js;
}

[htmlCode, cssCode, jsCode].forEach(area => {
    area.addEventListener('input', () => {
        clearTimeout(window.timer);
        window.timer = setTimeout(updateOutput, 500); // debounce 0.5s
    });
});
