package com.app.pebbletesting;

import android.app.DownloadManager;
import android.content.Context;
import android.os.SystemClock;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;

import com.getpebble.android.kit.PebbleKit;
import com.getpebble.android.kit.util.PebbleDictionary;
import com.squareup.okhttp.Call;
import com.squareup.okhttp.Callback;
import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.UUID;




public class MainActivity extends ActionBarActivity {

    private static final UUID APP_UUID = UUID.fromString("7df1068a-3b46-4a2d-adaa-32ca8091a6f2");

    private static final int KEY_BUTTON_UP = 0;
    private static final int KEY_BUTTON_DOWN = 1;
    private static final int KEY_BUTTON_SELECT = 2;
    private static final int KEY_BUTTON_SELECT_HOLD = 3;


    private static final String URL_BUTTON_UP = "http://192.168.43.77:3000/0";
    private static final String URL_BUTTON_DOWN = "http://192.168.43.77:3000/1";
    private static final String URL_BUTTON_SELECT = "http://192.168.43.77:3000/2";
    private static final String URL_BUTTON_SELECT_HOLD = "http://192.168.43.77:3000/3";

    private PebbleKit.PebbleDataReceiver mDataReceiver;
    Request request;

    OkHttpClient client;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }


    @Override
    protected void onResume() {
        super.onResume();

        if(mDataReceiver == null) {
            mDataReceiver = new PebbleKit.PebbleDataReceiver(APP_UUID) {

                @Override
                public void receiveData(Context context, int transactionId, PebbleDictionary dict) {
                    // Always ACK
                    PebbleKit.sendAckToPebble(context, transactionId);
                    client = new OkHttpClient();

                    // Up received?
                    if(dict.getInteger(KEY_BUTTON_UP) != null) {

                        request = new Request.Builder()
                                .url(URL_BUTTON_UP)
                                .build();

                    }

                    // Down received?
                    if(dict.getInteger(KEY_BUTTON_DOWN) != null) {

                        request = new Request.Builder()
                                .url(URL_BUTTON_DOWN)
                                .build();

                    }

                    if(dict.getInteger(KEY_BUTTON_SELECT) != null) {
                        request = new Request.Builder()
                                .url(URL_BUTTON_SELECT)
                                .build();
                    }

                    if(dict.getInteger(KEY_BUTTON_SELECT_HOLD) != null) {
                        request = new Request.Builder()
                                .url(URL_BUTTON_SELECT_HOLD)
                                .build();
                    }

                    client.newCall(request).enqueue(new Callback() {
                        @Override
                        public void onFailure(Request request, IOException e) {
                            Log.e("Main", "WE fucked up");
                        }

                        @Override
                        public void onResponse(Response response) throws IOException {
                            Log.e("Main", "I have no faith this will work");
                        }
                    });

                }

            };
            PebbleKit.registerReceivedDataHandler(getApplicationContext(), mDataReceiver);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

}
