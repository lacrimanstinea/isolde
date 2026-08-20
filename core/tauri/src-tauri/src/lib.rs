#[cfg(desktop)]
mod updater;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default().plugin(tauri_plugin_process::init());
    #[cfg(desktop)]
    let builder = builder.plugin(tauri_plugin_updater::Builder::new().build());

    #[cfg(desktop)]
    let builder = builder.manage(updater::PendingUpdate::default());

    builder
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .invoke_handler(tauri::generate_handler![
            check_for_update_cmd,
            install_update_cmd
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(desktop)]
#[tauri::command]
async fn check_for_update_cmd(
    app: tauri::AppHandle,
    state: tauri::State<'_, updater::PendingUpdate>,
) -> Result<updater::UpdateCheckResult, String> {
    updater::check_for_update(&app, &state).await
}

#[cfg(desktop)]
#[tauri::command]
async fn install_update_cmd(
    app: tauri::AppHandle,
    state: tauri::State<'_, updater::PendingUpdate>,
) -> Result<(), String> {
    updater::download_and_install_update(&app, &state).await
}

#[cfg(not(desktop))]
#[tauri::command]
async fn check_for_update_cmd() -> Result<(), String> {
    Err("Updater not available on this platform".into())
}

#[cfg(not(desktop))]
#[tauri::command]
async fn install_update_cmd() -> Result<(), String> {
    Err("Updater not available on this platform".into())
}
