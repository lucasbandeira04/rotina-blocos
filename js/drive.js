const CLIENT_ID = '915268231336-jf872u1pohhgeit7gll50gnve1ahpdbj.apps.googleusercontent.com'; // Substitua pelo seu Client ID do Google Cloud
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const FILE_NAME = 'energy_blocks_data.json';

let tokenClient;
let accessToken = null;
let driveFileId = null;

// DOM Elements
const btnDriveConnect = document.getElementById('btn-drive-connect');
const driveSyncStatus = document.getElementById('drive-sync-status');
const syncStatusText = document.getElementById('sync-status-text');
const btnSyncNow = document.getElementById('btn-sync-now');
const syncIcon = btnSyncNow.querySelector('i');

// Inicializa o Google Identity Services
function initGoogleDrive() {
    if (!CLIENT_ID || CLIENT_ID === 'YOUR_CLIENT_ID_HERE') {
        console.warn('Google Drive Client ID não configurado. Sincronização em nuvem desativada.');
        return;
    }

    try {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: (tokenResponse) => {
                if (tokenResponse && tokenResponse.access_token) {
                    accessToken = tokenResponse.access_token;
                    handleAuthSuccess();
                } else {
                    updateSyncUI('Erro de Autenticação', 'error', false);
                }
            },
            error_callback: (err) => {
                console.error("Erro OAuth", err);
                updateSyncUI('Erro ao Conectar', 'error', false);
            }
        });

        btnDriveConnect.addEventListener('click', handleAuthClick);
        btnSyncNow.addEventListener('click', downloadFromDrive);
    } catch (e) {
        console.error("Erro ao inicializar o Google Identity Services", e);
    }
}

function handleAuthClick() {
    if (tokenClient) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    }
}

async function handleAuthSuccess() {
    btnDriveConnect.style.display = 'none';
    driveSyncStatus.style.display = 'flex';
    
    // Inicia imediatamente o download após login bem-sucedido
    await downloadFromDrive();
}

function updateSyncUI(text, statusClass, isSpinning) {
    syncStatusText.textContent = text;
    driveSyncStatus.className = `sync-status ${statusClass}`;
    
    if (statusClass === 'error') {
        driveSyncStatus.style.color = 'var(--danger-color)';
    } else {
        driveSyncStatus.style.color = ''; // Reseta cor baseada na classe (via CSS)
    }

    if (isSpinning) {
        syncIcon.classList.add('spinning');
        btnSyncNow.disabled = true;
    } else {
        syncIcon.classList.remove('spinning');
        btnSyncNow.disabled = false;
    }
}

async function downloadFromDrive() {
    if (!accessToken) return;
    
    updateSyncUI('Sincronizando...', 'syncing', true);
    
    try {
        // Passo 1: Descobrir o File ID se ainda não temos
        let fileIdToDownload = driveFileId;
        
        if (!fileIdToDownload) {
            const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${FILE_NAME}' and trashed=false&spaces=drive`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            const data = await response.json();
            
            if (!response.ok) {
                console.error('Erro na API:', data);
                updateSyncUI('Erro ao Sincronizar', 'error', false);
                return;
            }
            
            if (data.files && data.files.length > 0) {
                fileIdToDownload = data.files[0].id;
                driveFileId = fileIdToDownload;
            } else {
                // Arquivo não existe no Drive. Enviar dados locais pela primeira vez.
                const localData = localStorage.getItem('energyBlocksData') || '[]';
                await uploadToDrive(localData, true);
                return; // uploadToDrive já altera a UI para Sincronizado
            }
        }
        
        // Passo 2: Baixar os dados
        const downloadRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileIdToDownload}?alt=media`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        
        if (downloadRes.ok) {
            const content = await downloadRes.text();
            if (window.syncDataFromDrive) {
                window.syncDataFromDrive(content);
            }
            updateSyncUI('Sincronizado ✓', 'online', false);
        } else {
            updateSyncUI('Erro ao Sincronizar', 'error', false);
        }
    } catch(err) {
        console.error('Erro:', err);
        updateSyncUI('Erro ao Sincronizar', 'error', false);
    }
}

async function uploadToDrive(fileContent, isInitialCreation = false) {
    if (!accessToken) return;
    
    updateSyncUI('Sincronizando...', 'syncing', true);
    
    try {
        if (!driveFileId || isInitialCreation) {
            // POST para criar arquivo
            const metadata = { name: FILE_NAME, mimeType: 'application/json' };
            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', new Blob([fileContent], { type: 'application/json' }));
            
            const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${accessToken}` },
                body: form
            });
            
            if (response.ok) {
                const data = await response.json();
                driveFileId = data.id;
                updateSyncUI('Sincronizado ✓', 'online', false);
            } else {
                updateSyncUI('Erro ao Sincronizar', 'error', false);
            }
        } else {
            // PATCH para atualizar
            const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${driveFileId}?uploadType=media`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: fileContent
            });
            
            if (response.ok) {
                updateSyncUI('Sincronizado ✓', 'online', false);
            } else {
                updateSyncUI('Erro ao Sincronizar', 'error', false);
            }
        }
    } catch(err) {
        console.error('Erro no upload:', err);
        updateSyncUI('Erro ao Sincronizar', 'error', false);
    }
}

window.uploadToDrive = uploadToDrive;
window.initGoogleDrive = initGoogleDrive;
