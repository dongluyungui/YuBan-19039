// 完整版Worker代码（直接粘贴）
export default {
  async fetch(request, env) {
      const { MESSAGES } = env;
      const corsHeaders = {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
      };

      // 处理预检请求
      if (request.method === "OPTIONS") {
          return new Response(null, { headers: corsHeaders });
      }

      // 获取留言
      if (request.method === "GET") {
          const data = await MESSAGES.get("messages");
          return new Response(data || "[]", { 
              headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
      }

      // 提交留言
      if (request.method === "POST") {
          try {
              const newMessage = await request.json();
              const messages = JSON.parse(await MESSAGES.get("messages") || "[]");
              
              messages.push({
                  ...newMessage,
                  timestamp: Date.now()
              });

              await MESSAGES.put("messages", JSON.stringify(messages));
              return new Response(JSON.stringify({ success: true }), {
                  headers: { ...corsHeaders, "Content-Type": "application/json" }
              });
          } catch (error) {
              return new Response(JSON.stringify({ error: "Invalid data" }), { 
                  status: 400,
                  headers: corsHeaders
              });
          }
      }

      return new Response("Not Found", { status: 404 });
  }
};