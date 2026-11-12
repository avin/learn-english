package io.github.avin.learnenglish

import android.os.Bundle
import android.view.View
import android.webkit.WebView
import androidx.activity.enableEdgeToEdge
import androidx.core.graphics.Insets
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : TauriActivity() {
  internal lateinit var tvWebView: WebView
    private set

  internal fun tvWebViewOrNull(): WebView? = if (::tvWebView.isInitialized) tvWebView else null

  override fun onWebViewCreate(webView: WebView) {
    super.onWebViewCreate(webView)
    // Android can recreate the activity and WebView while the Tauri plugin stays loaded.
    tvWebView = webView
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    enableEdgeToEdge()
    super.onCreate(savedInstanceState)
    MediaKeys.attach(this)

    val safeArea = WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout()
    ViewCompat.setOnApplyWindowInsetsListener(findViewById<View>(android.R.id.content)) { view, insets ->
      val padding = insets.getInsets(safeArea)
      view.setPadding(padding.left, padding.top, padding.right, padding.bottom)
      WindowInsetsCompat.Builder(insets).setInsets(safeArea, Insets.NONE).build()
    }
  }

  override fun onDestroy() {
    MediaKeys.release()
    super.onDestroy()
  }
}
