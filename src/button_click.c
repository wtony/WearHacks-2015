#include <pebble.h>

#define KEY_BUTTON_UP     0
#define KEY_BUTTON_DOWN   1
#define KEY_BUTTON_SELECT 2
#define KEY_BUTTON_SELECT_HOLD 3
  
static Window *window;
static TextLayer *text_layer;
static TextLayer *text_layer2;
static TextLayer *text_out;
int speed_pwm = 190;
static char txt[] = "190 PWM";

static void send(int key, int value);

static void outbox_sent_handler(DictionaryIterator *iter, void *context) {
  // Ready for next command
  //text_layer_set_text(text_out, "good");
}

static void outbox_failed_handler(DictionaryIterator *iter, AppMessageResult reason, void *context) {\
  //text_layer_set_text(text_out, "error");
  APP_LOG(APP_LOG_LEVEL_ERROR, "Fail reason: %d", (int)reason);
}

static void select_click_handler(ClickRecognizerRef recognizer, void *context) {
  speed_pwm = 190;
  snprintf(txt, sizeof(txt), "%3d PWM", speed_pwm);
  text_layer_set_text(text_layer, txt);
  
  send(KEY_BUTTON_SELECT, 0);
}

static void up_click_handler(ClickRecognizerRef recognizer, void *context) {
  if (speed_pwm + 5 >= 240) {
    speed_pwm = 240;  
  } else {
    speed_pwm += 5;
  }
  snprintf(txt, sizeof(txt), "%3d PWM", speed_pwm);
  text_layer_set_text(text_layer, txt);
  
  send(KEY_BUTTON_UP, 0);
}

static void down_click_handler(ClickRecognizerRef recognizer, void *context) {
  if (speed_pwm - 5 <= 140) {
    speed_pwm = 140;  
  } else {
    speed_pwm -= 5;
  }
  snprintf(txt, sizeof(txt), "%3d PWM", speed_pwm);
  text_layer_set_text(text_layer, txt);
  
  send(KEY_BUTTON_DOWN, 0);
}

static void select_hold_press_handler(ClickRecognizerRef recognizer, void *context) {
  send(KEY_BUTTON_SELECT_HOLD, 0);
  
  text_layer_set_text(text_layer, "breaking");
}

static void select_hold_release_handler (ClickRecognizerRef recognizer, void *context) {
  send(KEY_BUTTON_SELECT, 0);
  
  speed_pwm = 190;
  snprintf(txt, sizeof(txt), "%3d PWM", speed_pwm);
  text_layer_set_text(text_layer, txt);
}

static void click_config_provider(void *context) {
  window_single_click_subscribe(BUTTON_ID_SELECT, select_click_handler);
  window_single_click_subscribe(BUTTON_ID_UP, up_click_handler);
  window_single_click_subscribe(BUTTON_ID_DOWN, down_click_handler);
  window_long_click_subscribe(BUTTON_ID_SELECT, 400, select_hold_press_handler, select_hold_release_handler);
}

static void window_load(Window *window) {
  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);

  text_layer = text_layer_create((GRect) { .origin = { 5, 5 }, .size = { bounds.size.w, 20 } });
  text_layer_set_text(text_layer, txt);
  text_layer_set_text_alignment(text_layer, GTextAlignmentLeft);
  
  text_layer2 = text_layer_create((GRect) { .origin = { 70, 0}, .size = { bounds.size.w - 75, bounds.size.h} });
  text_layer_set_text(text_layer2, "\nspeed +\n\n\n\nslow/break\n\n\n\nspeed -");
  text_layer_set_text_alignment(text_layer2, GTextAlignmentRight);
  
  text_out = text_layer_create((GRect) { .origin = { 0, 50 }, .size = { bounds.size.w, 20 } });
  text_layer_set_text(text_out, "");
  text_layer_set_text_alignment(text_out, GTextAlignmentLeft);
  
  layer_add_child(window_layer, text_layer_get_layer(text_layer));
  layer_add_child(window_layer, text_layer_get_layer(text_layer2));
  layer_add_child(window_layer, text_layer_get_layer(text_out));
}

static void window_unload(Window *window) {
  text_layer_destroy(text_layer);
  text_layer_destroy(text_layer2);
}

static void init(void) {
  window = window_create();
  window_set_click_config_provider(window, click_config_provider);
  window_set_window_handlers(window, (WindowHandlers) {
	.load = window_load,
    .unload = window_unload,
  });
  const bool animated = true;
  window_stack_push(window, animated);
  
  //send 190 to initialize?
  
  app_message_register_outbox_sent(outbox_sent_handler);
  app_message_register_outbox_failed(outbox_failed_handler);
  app_message_open(app_message_inbox_size_maximum(), app_message_outbox_size_maximum());
}

static void deinit(void) {
  window_destroy(window);
}

static void send(int key, int value) {
  DictionaryIterator *iter;
  app_message_outbox_begin(&iter);

  dict_write_int(iter, key, &value, sizeof(int), true);

  app_message_outbox_send();
}

int main(void) {
  init();
  app_event_loop();
  deinit();
}