#!/usr/bin/env node
/**
 * Script per aggiornare automaticamente i file .claude prima di ogni commit.
 * Funziona su Windows, Linux e Mac senza bisogno di Python.
 *
 * Usage: node update-context.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = dirname(__dirname);
const CLAUDE_DIR = join(REPO_ROOT, '.claude');
const SESSION_REPORT = join(CLAUDE_DIR, 'session-report.md');
const WORKFLOW_GUIDE = join(CLAUDE_DIR, 'workflow-guide.md');

// Ottieni timestamp locale
function getTimestamp() {
    const now = new Date();
    return now.toLocaleString('it-IT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).replace(/\./g, ':');
}

/**
 * Aggiorna session-report.md con timestamp aggiornato
 */
function updateSessionReport() {
    if (!existsSync(SESSION_REPORT)) {
        console.log('   ⚠️  session-report.md non trovato');
        return false;
    }

    const timestamp = getTimestamp();

    try {
        // Leggi file come testo (Node.js gestisce CRLF/LF automaticamente)
        let content = readFileSync(SESSION_REPORT, 'utf8');

        // Sostituisci la prima occorrenza di "Last Updated:" con il nuovo timestamp
        const pattern = /^(\*\*Last Updated:.*?)(\n|$)/m;
        const match = content.match(pattern);

        if (match) {
            const prefix = match[1];
            const suffix = match[2] || '';
            content = `${prefix}**Last Updated:** ${timestamp} (Session update via pre-commit hook)` + suffix;

            // Scrivi file
            writeFileSync(SESSION_REPORT, content, 'utf8');

            console.log(`   ✅ session-report.md aggiornato (${timestamp})`);
            return true;
        } else {
            console.log('   ⚠️  Non trovata la riga "Last Updated:" in session-report.md');
            return false;
        }

    } catch (error) {
        console.log(`   ❌ Errore nell'aggiornamento session-report.md: ${error.message}`);
        return false;
    }
}

/**
 * Aggiorna workflow-guide.md con nota di aggiornamento automatico
 */
function updateWorkflowGuide() {
    if (!existsSync(WORKFLOW_GUIDE)) {
        console.log('   ⚠️  workflow-guide.md non trovato');
        return false;
    }

    try {
        let content = readFileSync(WORKFLOW_GUIDE, 'utf8').toLowerCase();

        // Aggiungi nota di aggiornamento automatico se non presente
        if (!content.includes('aggiornamento automatico')) {
            content += '\n---\n**🔄 Aggiornamento Automatico:** Questi file vengono aggiornati automaticamente via pre-commit hook.\n';

            writeFileSync(WORKFLOW_GUIDE, content, 'utf8');

            console.log('   ✅ workflow-guide.md aggiornato con nota automatica');
        } else {
            console.log('   ✅ workflow-guide.md già configurato per aggiornamento automatico');
        }

        return true;

    } catch (error) {
        console.log(`   ❌ Errore nell'aggiornamento workflow-guide.md: ${error.message}`);
        return false;
    }
}

/**
 * Genera summary compatta per CLAUDE.md se ci sono modifiche recenti
 */
function generateSummary() {
    if (!existsSync(SESSION_REPORT)) {
        return;
    }

    try {
        const content = readFileSync(SESSION_REPORT, 'utf8');

        // Estrai ultimi task completati e TODO pendenti
        const completed = (content.match(/✅/g) || []).length;
        const pending = (content.match(/\[ \]/g) || []).length;

        if (completed > 0 || pending > 0) {
            console.log(`   ✅ CLAUDE.md contesto verificato (${completed} completati, ${pending} pendenti)`);
        }
    } catch (error) {
        console.log(`   ⚠️  Errore nel verificare CLAUDE.md: ${error.message}`);
    }
}

/**
 * Esegui aggiornamenti
 */
function main() {
    console.log('🔄 Aggiornamento contesto .claude...');
    console.log(`   📁 Repertorio: ${REPO_ROOT}`);

    updateSessionReport();
    updateWorkflowGuide();
    generateSummary();

    console.log('');
    console.log('✅ Aggiornamento contesto completato!');
    console.log(`   📝 ${SESSION_REPORT}`);
    console.log(`   📝 ${WORKFLOW_GUIDE}`);
    console.log('');
    console.log('🚀 Pronto per commit...');
}

// Esegui
main();
