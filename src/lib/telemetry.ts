type Event = { name: string; props?: Record<string, any> };

export function track(event: Event){
  try{
    // Demo: log to console; replace with real telemetry later
    // eslint-disable-next-line no-console
    console.log("telemetry", event.name, event.props ?? {});
  }catch{
    // noop
  }
}


