<template>
    <DashboardCard title="V2Ray Configuration">
      <form @submit.prevent="processConfig" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            V2Ray Config URL
          </label>
          <input
            v-model="configUrl"
            type="text"
            class="w-full p-2 border rounded-md"
            placeholder="vless://..."
          />
        </div>
        
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Update Config
        </button>
  
        <div v-if="parsedConfig" class="mt-4">
          <h3 class="font-medium mb-2">Parsed Configuration:</h3>
          <pre class="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">{{ JSON.stringify(parsedConfig, null, 2) }}</pre>
        </div>
  
        <div v-if="error" class="text-red-500 mt-2">
          {{ error }}
        </div>
      </form>
    </DashboardCard>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const configUrl = ref('')
  const parsedConfig = ref(null)
  const error = ref('')
  
  function parseVlessUrl(url: string) {
    try {
      // Remove "vless://" prefix
      const cleanUrl = url.replace('vless://', '')
      
      // Split into parts
      const [userInfo, serverInfo] = cleanUrl.split('@')
      const [serverAddress, queryString] = serverInfo.split('?')
      const [host, port] = serverAddress.split(':')
      
      // Parse query parameters
      const params = new URLSearchParams(queryString)
      const hostParam = params.get('host')
      const pathParam = params.get('path') || '/'
  
      // Create configuration matching your existing structure
      const config = {
        inbounds: [
          {
            port: 1081,
            protocol: "dokodemo-door",
            settings: {
              network: "tcp",
              followRedirect: true
            },
            sniffing: {
              enabled: true,
              destOverride: ["http", "tls"]
            }
          }
        ],
        outbounds: [
          {
            protocol: "vless",
            settings: {
              vnext: [
                {
                  address: host,
                  port: parseInt(port),
                  users: [
                    {
                      id: userInfo,
                      encryption: "none"
                    }
                  ]
                }
              ]
            },
            streamSettings: {
              network: "tcp",
              security: "none",
              tcpSettings: {
                header: {
                  type: "http",
                  request: {
                    headers: {
                      Host: [hostParam || "speedtest.net"]
                    },
                    path: [pathParam]
                  }
                }
              }
            },
            tag: "proxy"
          },
          {
            tag: "direct",
            protocol: "freedom",
            settings: {}
          }
        ],
        routing: {
          domainStrategy: "IPIfNonMatch",
          rules: [
            {
              type: "field",
              ip: ["geoip:ir", "geoip:private"],
              outboundTag: "direct"
            },
            {
              type: "field",
              domain: ["regexp:.*\\.ir$"],
              outboundTag: "direct"
            },
            {
              type: "field",
              network: "tcp,udp",
              outboundTag: "proxy"
            }
          ]
        }
      }
  
      parsedConfig.value = config
      error.value = ''
    } catch (e) {
      error.value = 'Invalid V2Ray configuration URL'
      parsedConfig.value = null
    }
  }
  
  async function processConfig() {
    try {
      parseVlessUrl(configUrl.value)
      
      if (parsedConfig.value) {
        // Send configuration to server
        const response = await fetch('/api/v2ray/config', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(parsedConfig.value)
        })
        
        if (!response.ok) throw new Error('Failed to update configuration')
        
        error.value = ''
      }
    } catch (e) {
      error.value = e.message
    }
  }
  </script>