from asgiref.sync import async_to_sync, sync_to_async
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
import json


class DataConsumer(AsyncWebsocketConsumer):
    # user_ready 메시지를 처리하는 메서드
    async def user_ready(self, event):
        pass
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'data_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')
        kid = text_data_json.get('kid')

        if message_type == 'ready' and kid is not None:
            try:
                await self.update_user_ready(kid, True)
            except userInfo.DoesNotExist:
                print(f"No user with kid {kid} exists.")
                return

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_ready',
                    'message': f'User {kid} is ready.'
                }
            )
        elif message_type == 'not_ready' and kid is not None:
            try:
                await self.update_user_ready(kid, False)
            except userInfo.DoesNotExist:
                print(f"No user with kid {kid} exists.")
                return

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_not_ready',
                    'message': f'User {kid} is not ready.'
                }
            )

    # 데이터베이스 업데이트 함수
    @sync_to_async
    def update_user_ready(self, kid, ready):
        from common.models import userInfo, menInfo, womenInfo
        user = userInfo.objects.get(kid=kid)
        if user.ismale:
            menInfo.objects.filter(user=user).update(ready=ready)
        else:
            womenInfo.objects.filter(user=user).update(ready=ready)