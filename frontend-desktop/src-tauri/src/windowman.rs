use tauri::Manager;

#[tauri::command]
pub async fn close_remote(window: tauri::Window) {
    // Close remote
    if let Some(remote) = window.get_webview_window("remote") {
        remote.close().unwrap();
    }
    // Show main window
    window.get_webview_window("main").unwrap();
    window.get_webview_window("main").unwrap().show().unwrap();
}

#[tauri::command]
pub async fn create_window(app: tauri::AppHandle, url: String) {
    let webview_window = tauri::WebviewWindowBuilder::new(
        &app,
        "remote",
        tauri::WebviewUrl::App(url.clone().into()),
    );

    webview_window
        .fullscreen(true)
        .decorations(false)
        .title(format!("Remotelify | {main_url}", main_url = url))
        .build()
        .unwrap();
}
