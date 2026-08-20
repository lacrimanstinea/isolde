use serde::Serialize;
use std::sync::Mutex;
use tauri::Emitter;
use tauri_plugin_updater::{Update, UpdaterExt};

#[derive(Serialize)]
#[serde(tag = "status")]
pub enum UpdateCheckResult {
    Available { version: String },
    UpToDate,
}

#[derive(Default)]
pub struct PendingUpdate(pub Mutex<Option<Update>>);

pub async fn check_for_update(
    app: &tauri::AppHandle,
    state: &tauri::State<'_, PendingUpdate>,
) -> Result<UpdateCheckResult, String> {
    let updater = app.updater().map_err(|e| e.to_string())?;
    match updater.check().await {
        Ok(Some(update)) => {
            let version = update.version.clone();
            *state.0.lock().unwrap() = Some(update);
            Ok(UpdateCheckResult::Available { version })
        }
        Ok(None) => {
            *state.0.lock().unwrap() = None;
            Ok(UpdateCheckResult::UpToDate)
        }
        Err(e) => Err(e.to_string()),
    }
}

pub async fn download_and_install_update(
    app: &tauri::AppHandle,
    state: &tauri::State<'_, PendingUpdate>,
) -> Result<(), String> {
    let update = state
        .0
        .lock()
        .unwrap()
        .take()
        .ok_or("No pending update to install")?;

    let app_handle = app.clone();
    let mut downloaded: usize = 0;

    update
        .download_and_install(
            move |chunk_length, content_length| {
                downloaded += chunk_length;
                let _ = app_handle.emit(
                    "updater:progress",
                    serde_json::json!({
                        "downloaded": downloaded,
                        "total": content_length,
                    }),
                );
            },
            || {},
        )
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}
