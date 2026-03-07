use std::fs;
use std::path::PathBuf;

use tauri::Manager;

fn get_state_file_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
  let app_local_dir = app
    .path()
    .app_local_data_dir()
    .map_err(|err| format!("failed to resolve app local dir: {err}"))?;

  fs::create_dir_all(&app_local_dir)
    .map_err(|err| format!("failed to create app local dir: {err}"))?;

  Ok(app_local_dir.join("resume_state.json"))
}

#[tauri::command]
fn load_local_state(app: tauri::AppHandle) -> Result<Option<String>, String> {
  let path = get_state_file_path(&app)?;

  if !path.exists() {
    return Ok(None);
  }

  let content =
    fs::read_to_string(path).map_err(|err| format!("failed to read local state file: {err}"))?;
  Ok(Some(content))
}

#[tauri::command]
fn save_local_state(app: tauri::AppHandle, content: String) -> Result<(), String> {
  let path = get_state_file_path(&app)?;
  fs::write(path, content).map_err(|err| format!("failed to write local state file: {err}"))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![load_local_state, save_local_state])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
