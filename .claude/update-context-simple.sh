#!/bin/bash
# Script semplice per aggiornare i file .claude prima di ogni commit

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLAUDE_DIR="$REPO_ROOT/.claude"
SESSION_REPORT="$CLAUDE_DIR/session-report.md"
WORKFLOW_GUIDE="$CLAUDE_DIR/workflow-guide.md"

echo "🔄 Aggiornamento contesto .claude.>"

# 1. Aggiorna session-report.md con timestamp aggiornato
if [ -f "$SESSION_REPORT" ]; then
    TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

    # Usa sed per sostituire la riga Last Updated (gestisce CRLF e LF)
    sed -i '0,/Last Updated:/s//Last Updated: '"$TIMESTAMP"' (Session update via pre-commit hook)/' "$SESSION_REPORT"

    echo "   ✅ session-report.md aggiornato ($TIMESTAMP)"
fi

# 2. Aggiorna workflow-guide.md con nota di aggiornamento automatico se non presente
if [ -f "$WORKFLOW_GUIDE" ]; then
    if ! grep -q "aggiornamento automatico" "$WORKFLOW_GUIDE"; then
        echo "" >> "$WORKFLOW_GUIDE"
        echo "---" >> "$WORKFLOW_GUIDE"
        echo "**🔄 Aggiornamento Automatico:** Questi file vengono aggiornati automaticamente via pre-commit hook." >> "$WORKFLOW_GUIDE"
        echo "   ✅ workflow-guide.md aggiornato con nota automatica"
    else
        echo "   ✅ workflow-guide.md già configurato per aggiornamento automatico"
    fi
fi

echo ""
echo "✅ Aggiornamento contesto completato!"
echo "   📁 .claude/session-report.md"
echo "   📁 .claude/workflow-guide.md"
echo ""
echo "🚀 Pronto per commit.>."
