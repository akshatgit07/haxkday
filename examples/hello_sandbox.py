import os

from daytona import Daytona, DaytonaConfig

config = DaytonaConfig(api_key=os.environ["DAYTONA_API_KEY"])

daytona = Daytona(config)

sandbox = daytona.create()

try:
    response = sandbox.process.code_run('print("Hello World from code!")')
    if response.exit_code != 0:
        print(f"Error: {response.exit_code} {response.result}")
    else:
        print(response.result)
finally:
    sandbox.delete()
