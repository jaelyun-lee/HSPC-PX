package org.clinical.crpc;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import android.view.View;

/** Offline research calculator. No bridge, network permission, or persistence. */
public final class MainActivity extends Activity {
 private WebView web;
 @Override public void onCreate(Bundle state) {
  super.onCreate(state);
  getWindow().setStatusBarColor(0xffeff4f6);
  getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
  web = new WebView(this);
  web.getSettings().setJavaScriptEnabled(true);
  web.getSettings().setDomStorageEnabled(false);
  web.getSettings().setAllowFileAccess(false);
  web.getSettings().setAllowContentAccess(false);
  web.getSettings().setBlockNetworkLoads(true);
  web.getSettings().setSaveFormData(false);
  web.setWebViewClient(new WebViewClient() {
   @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) { return true; }
  });
  web.setOnApplyWindowInsetsListener((v, insets) -> {
   v.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(), insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
   return insets;
  });
  setContentView(web);
  // Bundled Android assets remain accessible when general filesystem access is disabled.
  web.loadUrl("file:///android_asset/index.html");
 }
 @Override protected void onDestroy() { if(web!=null) {web.stopLoading();web.destroy();} super.onDestroy(); }
}
